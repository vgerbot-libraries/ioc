import { ComponentClass } from './ComponentClass';
import { ClassMetadataReader } from '../metadata/ClassMetadata';
import { ApplicationContext } from './ApplicationContext';
import { GlobalMetadata } from '../metadata/GlobalMetadata';
import { ComponentFactory } from './ComponentFactory';
import { Lifecycle } from './Lifecycle';
import { UnknownTypeInstance } from './UnknownTypeInstance';
import { AnyFunction } from '../types/AnyCallback';

export class ComponentInstanceBuilder {
    private getConstructorArgs: () => unknown[] = () => [];
    private propertyFactories: Record<string | symbol, ComponentFactory> = {};
    private preInjectMethods: Array<string | symbol> = [];
    private postInjectMethods: Array<string | symbol> = [];
    private preDestroyMethods: Array<string | symbol> = [];
    constructor(private readonly componentClass: ComponentClass, private readonly container: ApplicationContext) {
        //
    }
    appendClassMetadata(classMetadataReader: ClassMetadataReader) {
        const types = classMetadataReader.getConstructorParameterTypes();
        this.getConstructorArgs = () => {
            return types.map(it => {
                return this.container.getComponentInstance(it);
            });
        };
        const properties = classMetadataReader.getPropertyTypeMap();
        const globalMetadata = GlobalMetadata.getInstance().reader();
        for (const [propertyName, propertyType] of properties) {
            const factory = globalMetadata.getComponentFactory(propertyType);
            if (!factory) {
                continue;
            }
            this.propertyFactories[propertyName] = factory;
        }
        this.preInjectMethods.push(...classMetadataReader.getMethods(Lifecycle.PRE_INJECT));
        this.postInjectMethods.push(...classMetadataReader.getMethods(Lifecycle.POST_INJECT));
        this.preDestroyMethods.push(...classMetadataReader.getMethods(Lifecycle.PRE_DESTROY));
    }
    build() {
        const args = this.getConstructorArgs();
        const instance = new this.componentClass(...args);
        this.invokeLifecycleMethods(instance, this.preInjectMethods);
        for (const key in this.propertyFactories) {
            const factory = this.propertyFactories[key] as ComponentFactory;
            instance[key] = factory(this.container, instance);
        }
        this.invokeLifecycleMethods(instance, this.postInjectMethods);
        const off = this.container.onPreDestroy(() => {
            this.invokeLifecycleMethods(instance, this.preDestroyMethods);
            off();
        });
    }
    private invokeLifecycleMethods(instance: UnknownTypeInstance, methodKeys: Array<string | symbol>) {
        methodKeys.forEach(key => {
            this.container.invoke(instance[key] as AnyFunction, instance);
        });
    }
}
