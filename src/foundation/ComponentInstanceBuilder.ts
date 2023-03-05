import { Newable } from '../types/Newable';
import { ClassMetadataReader } from '../metadata/ClassMetadata';
import { ApplicationContext } from './ApplicationContext';
import { Lifecycle } from './Lifecycle';
import { Instance } from '../types/Instance';
import { defineLazyProperty } from '../utils/defineLazyProperty';
import { ServiceFactoryDef } from './ServiceFactoryDef';
import { GlobalMetadata } from '../metadata/GlobalMetadata';
import { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';

export class ComponentInstanceBuilder<T> {
    private getConstructorArgs: () => unknown[] = () => [];
    private propertyFactories: Record<string | symbol, ServiceFactoryDef<unknown>> = {};
    private preInjectMethods: Array<string | symbol> = [];
    private postInjectMethods: Array<string | symbol> = [];
    private instAwareProcessorClasses: Set<Newable<PartialInstAwareProcessor>> = new Set();
    constructor(private readonly componentClass: Newable<T>, private readonly container: ApplicationContext) {
        //
    }
    appendInstAwareProcessorClasses(
        instAwareProcessorClasses: Set<Newable<PartialInstAwareProcessor>> | Array<Newable<PartialInstAwareProcessor>>
    ) {
        instAwareProcessorClasses.forEach(it => {
            this.instAwareProcessorClasses.add(it);
        });
    }
    appendClassMetadata<T>(classMetadataReader: ClassMetadataReader<T>) {
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
        this.preInjectMethods = classMetadataReader.getMethods(Lifecycle.PRE_INJECT);
        this.postInjectMethods = classMetadataReader.getMethods(Lifecycle.POST_INJECT);
    }
    build() {
        const args = this.getConstructorArgs();
        const properties = this.createPropertiesGetterBuilder();
        const isCreatingInstAwareProcessor = this.instAwareProcessorClasses.has(
            this.componentClass as Newable<PartialInstAwareProcessor>
        );
        if (isCreatingInstAwareProcessor) {
            const instance = new this.componentClass(...args) as Instance<T>;
            this.invokeLifecycleMethods(instance, this.preInjectMethods);
            for (const key in properties) {
                const getter = properties[key](instance);
                defineLazyProperty(instance, key, getter);
            }
            this.invokeLifecycleMethods(instance, this.postInjectMethods);
            return instance;
        } else {
            let instance: Instance<T> | undefined;
            const instAwareProcessorClasses = Array.from(this.instAwareProcessorClasses);
            const instAwareProcessors = instAwareProcessorClasses.map(it =>
                this.container.getInstance<PartialInstAwareProcessor, void>(it)
            );
            instAwareProcessors.some(processor => {
                if (!processor.beforeInstantiation) {
                    return false;
                }
                instance = processor.beforeInstantiation<T>(this.componentClass, args) as Instance<T>;
                return !!instance;
            });
            if (!instance) {
                instance = new this.componentClass(...args) as Instance<T>;
            }
            this.invokeLifecycleMethods(instance, this.preInjectMethods);
            for (const key in properties) {
                const getter = properties[key](instance);
                defineLazyProperty(instance, key, getter);
            }
            instAwareProcessors.forEach(processor => {
                if (processor.afterInstantiation) {
                    processor.afterInstantiation(instance);
                }
            });
            this.invokeLifecycleMethods(instance, this.postInjectMethods);
            return instance;
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
    private invokeLifecycleMethods(instance: Instance<T>, methodKeys: Array<string | symbol>) {
        methodKeys.forEach(key => {
            this.container.invoke(instance[key], {
                context: instance
            });
        });
    }
}
