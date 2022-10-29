import { Newable } from './Newable';
import { ClassMetadataReader } from '../metadata/ClassMetadata';
import { ApplicationContext } from './ApplicationContext';
import { ServiceFactory } from './ServiceFactory';
import { Lifecycle } from './Lifecycle';
import { Instance } from './Instance';
import { AnyFunction } from '../types/AnyFunction';
import { defineLazyProperty } from '../utils/defineLazyProperty';

export class ComponentInstanceBuilder<T> {
    private getConstructorArgs: () => unknown[] = () => [];
    private propertyFactories: Record<string | symbol, ServiceFactory<any>> = {};
    private preInjectMethods: Array<string | symbol> = [];
    private postInjectMethods: Array<string | symbol> = [];
    private preDestroyMethods: Array<string | symbol> = [];
    constructor(private readonly componentClass: Newable<T>, private readonly container: ApplicationContext) {
        //
    }
    appendClassMetadata(classMetadataReader: ClassMetadataReader) {
        const types = classMetadataReader.getConstructorParameterTypes();
        this.getConstructorArgs = () => {
            return types.map(it => {
                return this.container.getInstance(it);
            });
        };
        const properties = classMetadataReader.getPropertyTypeMap();
        for (const [propertyName, propertyType] of properties) {
            if (typeof propertyType === 'function') {
                this.propertyFactories[propertyName] = (container, owner) => {
                    return container.getInstance(propertyType, owner) as any;
                };
                continue;
            }
            const factory = this.container.getFactory(propertyType);
            if (!factory) {
                continue;
            }
            this.propertyFactories[propertyName] = factory;
        }
        this.preInjectMethods = classMetadataReader.getMethods(Lifecycle.PRE_INJECT);
        this.postInjectMethods = classMetadataReader.getMethods(Lifecycle.POST_INJECT);
        this.preDestroyMethods = classMetadataReader.getMethods(Lifecycle.PRE_DESTROY);
    }
    build() {
        const args = this.getConstructorArgs();
        const instance = new this.componentClass(...args) as Instance<T>;
        this.invokeLifecycleMethods(instance, this.preInjectMethods);
        for (const key in this.propertyFactories) {
            const factory = this.propertyFactories[key];
            defineLazyProperty(instance, key, () => {
                return factory(this.container, instance);
            });
        }
        this.invokeLifecycleMethods(instance, this.postInjectMethods);
        const off = this.container.onPreDestroy(() => {
            this.invokeLifecycleMethods(instance, this.preDestroyMethods);
            off();
        });
        return instance;
    }
    private invokeLifecycleMethods(instance: Instance<T>, methodKeys: Array<string | symbol>) {
        methodKeys.forEach(key => {
            this.container.invoke(instance[key] as AnyFunction, {
                context: instance
            });
        });
    }
}
