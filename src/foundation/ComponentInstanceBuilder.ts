import { Newable } from '../types/Newable';
import { ClassMetadataReader } from '../metadata/ClassMetadata';
import { ApplicationContext } from './ApplicationContext';
import { Lifecycle } from './Lifecycle';
import { Instance } from '../types/Instance';
import { defineLazyProperty } from '../utils/defineLazyProperty';
import { ServiceFactoryDef } from './ServiceFactoryDef';
import { GlobalMetadata } from '../metadata/GlobalMetadata';

export class ComponentInstanceBuilder<T> {
    private getConstructorArgs: () => unknown[] = () => [];
    private propertyFactories: Record<string | symbol, ServiceFactoryDef<unknown>> = {};
    private preInjectMethods: Array<string | symbol> = [];
    private postInjectMethods: Array<string | symbol> = [];
    constructor(private readonly componentClass: Newable<T>, private readonly container: ApplicationContext) {
        //
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
        const instance = new this.componentClass(...args) as Instance<T>;
        this.invokeLifecycleMethods(instance, this.preInjectMethods);
        for (const key in this.propertyFactories) {
            const { factory, injections } = this.propertyFactories[key];
            const fn = factory(this.container, instance);
            defineLazyProperty(instance, key, () => {
                return this.container.invoke(fn, {
                    injections
                });
            });
        }
        this.invokeLifecycleMethods(instance, this.postInjectMethods);
        return instance;
    }
    private invokeLifecycleMethods(instance: Instance<T>, methodKeys: Array<string | symbol>) {
        methodKeys.forEach(key => {
            this.container.invoke(instance[key], {
                context: instance
            });
        });
    }
}
