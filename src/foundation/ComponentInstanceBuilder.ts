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
    private propertyFactories = new FactoryRecorder();
    private lazyMode: boolean = true;
    private lifecycleResolver: LifecycleManager<T>;
    private classMetadataReader: ClassMetadataReader<T>;
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
                return this.container.getInstance(it);
            });
        };
        const globalMetadataReader = GlobalMetadata.getReader();
        const propertyTypes = classMetadataReader.getPropertyTypeMap();
        for (const [propertyName, propertyType] of propertyTypes) {
            if (typeof propertyType === 'function') {
                this.propertyFactories.append(propertyName, (container, owner) => {
                    return () => container.getInstance(propertyType, owner);
                });
                continue;
            }
            const factoryDef = this.container.getFactory(propertyType);
            if (factoryDef) {
                this.propertyFactories.set(propertyName, factoryDef);
                continue;
            }
            const propertyClassMetadata = globalMetadataReader.getClassMetadata(propertyType);
            if (propertyClassMetadata) {
                this.propertyFactories.set(propertyName, ServiceFactoryDef.createFromClassMetadata(propertyClassMetadata));
                continue;
            }
            const propertyFactoryDef = globalMetadataReader.getComponentFactory(propertyType);
            if (propertyFactoryDef) {
                this.propertyFactories.set(propertyName, propertyFactoryDef);
                continue;
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
            for (const key in properties) {
                const getter = properties[key](instance);
                this.defineProperty(instance, key, getter);
            }
            this.lifecycleResolver.invokePostInjectMethod(instance);
            return instance;
        } else {
            let instance: undefined | Instance<T> = this.instAwareProcessorManager.beforeInstantiation(this.componentClass, args);
            if (!instance) {
                instance = new this.componentClass(...args) as Instance<T>;
            }
            this.lifecycleResolver.invokePreInjectMethod(instance);
            for (const key in properties) {
                const getter = properties[key](instance);
                this.defineProperty(instance, key, getter);
            }
            instance = this.instAwareProcessorManager.afterInstantiation(instance);
            this.lifecycleResolver.invokePostInjectMethod(instance);
            return instance;
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
        const result = {} as Record<keyof T, (instance: T) => () => unknown | unknown[]>;
        const propertyTypeMap = this.classMetadataReader.getPropertyTypeMap();
        for (const [key, factoryDef] of this.propertyFactories.iterator()) {
            const isArray = (propertyTypeMap.get(key) as unknown) === Array;
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
                result[key as keyof T] = <T>(instance: T) => {
                    const producer = factory(this.container, instance);
                    return () => {
                        return this.container.invoke(producer, {
                            injections
                        });
                    };
                };
            } else {
                result[key as keyof T] = <T>(instance: T) => {
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
                };
            }
        }
        return result;
    }
}
