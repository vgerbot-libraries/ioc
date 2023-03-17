import { Newable } from '../types/Newable';
import { ClassMetadata, ClassMetadataReader } from '../metadata/ClassMetadata';
import { ApplicationContext } from './ApplicationContext';
import { Instance } from '../types/Instance';
import { ServiceFactoryDef } from './ServiceFactoryDef';
import { GlobalMetadata } from '../metadata/GlobalMetadata';
import { lazyProp } from '@vgerbot/lazy';
import { MetadataFactory } from '../metadata/MetadataFactory';
import { InstantiationAwareProcessorManager } from './InstantiationAwareProcessorManager';
import { LifecycleManager } from './LifecycleManager';

export class ComponentInstanceBuilder<T> {
    private getConstructorArgs: () => unknown[] = () => [];
    private propertyFactories: Record<string | symbol, ServiceFactoryDef<unknown>> = {};
    private lazyMode: boolean = true;
    private lifecycleResolver: LifecycleManager<T>;
    constructor(
        private readonly componentClass: Newable<T>,
        private readonly container: ApplicationContext,
        private readonly instAwareProcessorManager: InstantiationAwareProcessorManager
    ) {
        this.lifecycleResolver = new LifecycleManager<T>(componentClass, container);
        const reader = MetadataFactory.getMetadata(componentClass, ClassMetadata).reader();
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
        const globalMetadataReader = GlobalMetadata.getInstance().reader();
        const properties = classMetadataReader.getPropertyTypeMap();
        for (const [propertyName, propertyType] of properties) {
            if (typeof propertyType === 'function') {
                this.propertyFactories[propertyName] = new ServiceFactoryDef((container, owner) => {
                    return () => container.getInstance(propertyType, owner);
                });
                continue;
            }
            const factory = this.container.getFactory(propertyType);
            if (factory) {
                this.propertyFactories[propertyName] = factory;
                continue;
            }
            const propertyClassMetadata = globalMetadataReader.getClassMetadata(propertyType);
            if (propertyClassMetadata) {
                this.propertyFactories[propertyName] = ServiceFactoryDef.createFromClassMetadata(propertyClassMetadata);
                continue;
            }
            const propertyFactory = globalMetadataReader.getComponentFactory(propertyType);
            if (propertyFactory) {
                this.propertyFactories[propertyName] = propertyFactory;
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
        const result = {} as Record<keyof T, (instance: T) => () => unknown>;
        for (const key in this.propertyFactories) {
            const { factory, injections } = this.propertyFactories[key];
            result[key as keyof T] = <T>(instance: T) => {
                const fn = factory(this.container, instance);
                return () => {
                    return this.container.invoke(fn, {
                        injections
                    });
                };
            };
        }
        return result;
    }
}
