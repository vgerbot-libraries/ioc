import { Newable } from '../types/Newable';
import { ClassMetadata, ClassMetadataReader } from '../metadata/ClassMetadata';
import { ApplicationContext } from './ApplicationContext';
import { Instance } from '../types/Instance';
import { ServiceFactoryDef } from './ServiceFactoryDef';
import { GlobalMetadata } from '../metadata/GlobalMetadata';
import { lazyProp } from '@vgerbot/lazy';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';
import { InstantiationAwareProcessorManager } from './InstantiationAwareProcessorManager';
import { LifecycleManager } from './LifecycleManager';
import { FactoryRecorder } from '../common/FactoryRecorder';
import { AnyFunction } from '../types/AnyFunction';
import { Identifier } from '../types/Identifier';
import { ServiceFactory } from '../types/ServiceFactory';

export class ComponentInstanceBuilder<T> {
    private getConstructorArgs: () => unknown[] = () => [];
    private readonly propertyFactories = new FactoryRecorder();
    private lazyMode: boolean = true;
    private readonly lifecycleResolver: LifecycleManager<T>;
    private readonly classMetadataReader: ClassMetadataReader<T>;
    constructor(
        private readonly componentClass: Newable<T>,
        private readonly container: ApplicationContext,
        private readonly instAwareProcessorManager: InstantiationAwareProcessorManager
    ) {
        this.lifecycleResolver = new LifecycleManager<T>(componentClass, container);
        const reader = MetadataInstanceManager.getMetadata(componentClass, ClassMetadata).reader();
        this.classMetadataReader = reader;
        this.appendClassMetadata(reader);
    }
    appendLazyMode(lazyMode: boolean) {
        this.lazyMode = lazyMode;
    }
    private appendClassMetadata<T>(classMetadataReader: ClassMetadataReader<T>) {
        const types = classMetadataReader.getConstructorParameterTypes();
        this.getConstructorArgs = () => {
            return types.map(it => {
                return this.container.getInstance(it.isNewable ? it.clazz : it.identifier);
            });
        };
        const globalMetadataReader = GlobalMetadata.getReader();
        const propertyTypes = classMetadataReader.getPropertyTypeMap();
        for (const [propertyName, propertyType] of propertyTypes) {
            if (propertyType.isNewable) {
                this.propertyFactories.append(propertyName, (container, owner) => {
                    return () => container.getInstance(propertyType.clazz, owner);
                });
                continue;
            }
            const identifier = propertyType.identifier as Exclude<Identifier, Newable<unknown>>;
            const factoryDef = this.container.getFactory(identifier);
            if (factoryDef) {
                this.propertyFactories.set(propertyName, factoryDef);
                continue;
            }
            const propertyClassMetadata = globalMetadataReader.getClassMetadata(identifier);
            if (propertyClassMetadata) {
                this.propertyFactories.set(propertyName, ServiceFactoryDef.createFromClassMetadata(propertyClassMetadata));
                continue;
            }
            const propertyFactoryDef = globalMetadataReader.getComponentFactory(identifier);
            if (propertyFactoryDef) {
                this.propertyFactories.set(propertyName, propertyFactoryDef);
            }
        }
    }
    build() {
        const args = this.getConstructorArgs();
        const properties = this.createPropertiesGetterBuilder();
        const isCreatingInstAwareProcessor = this.instAwareProcessorManager.isInstAwareProcessorClass(this.componentClass);
        if (isCreatingInstAwareProcessor) {
            const instance = new this.componentClass(...args) as Instance<T>;
            this.lifecycleResolver.invokePreInjectMethod(instance);
            defineProperties.call(this, instance);
            this.lifecycleResolver.invokePostInjectMethod(instance);
            return instance;
        } else {
            let instance: undefined | Instance<T> = this.instAwareProcessorManager.beforeInstantiation(this.componentClass, args);
            if (!instance) {
                instance = new this.componentClass(...args) as Instance<T>;
            }
            this.lifecycleResolver.invokePreInjectMethod(instance);
            defineProperties.call(this, instance);
            instance = this.instAwareProcessorManager.afterInstantiation(instance);
            this.lifecycleResolver.invokePostInjectMethod(instance);
            return instance;
        }

        function defineProperties(this: ComponentInstanceBuilder<T>, instance: Instance<T> | undefined) {
            properties.forEach((value, key) => {
                const getter = value(instance as T);
                this.defineProperty(instance, typeof key === 'number' ? key + '' : key, getter);
            });
        }
    }
    private defineProperty<T, V>(instance: T, key: string | symbol, getter: () => V) {
        if (this.lazyMode) {
            lazyProp(instance, key, getter);
        } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            instance[key] = getter();
        }
    }
    private createPropertiesGetterBuilder() {
        const result = new Map<keyof T, (instance: T) => () => unknown | unknown[]>();
        const propertyTypeMap = this.classMetadataReader.getPropertyTypeMap();
        for (const [key, factoryDef] of this.propertyFactories.iterator()) {
            const injectionType = propertyTypeMap.get(key)!;
            const isArray = !injectionType.isNewable && injectionType.clazz === (Array as unknown as Newable<unknown>);
            if (!isArray) {
                if (factoryDef.factories.size > 1) {
                    throw new Error(
                        // eslint-disable-next-line max-len
                        `Multiple matching injectables found for property injection,\nbut property ${key.toString()} is not an array,
                        It is ambiguous to determine which object should be injected!`
                    );
                }
                const [factory, injections] = factoryDef.factories.entries().next().value as [
                    ServiceFactory<unknown, unknown>,
                    Identifier[]
                ];
                result.set(key as keyof T, <T>(instance: T) => {
                    const producer = factory(this.container, instance);
                    return () => {
                        return this.container.invoke(producer, {
                            injections
                        });
                    };
                });
            } else {
                result.set(key as keyof T, <T>(instance: T) => {
                    const producerAndInjections = Array.from(factoryDef.factories).map(
                        ([factory, injections]) =>
                            [factory(this.container, instance), injections] as [AnyFunction<unknown>, Identifier[]]
                    );

                    return () => {
                        return producerAndInjections.map(([producer, injections]) => {
                            return this.container.invoke(producer, {
                                injections
                            });
                        });
                    };
                });
            }
        }
        return result;
    }
}
