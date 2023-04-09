import { Newable } from '../types/Newable';
import { ApplicationContext } from './ApplicationContext';
import { Instance } from '../types/Instance';
import { InstantiationAwareProcessorManager } from './InstantiationAwareProcessorManager';
export declare class ComponentInstanceBuilder<T> {
    private readonly componentClass;
    private readonly container;
    private readonly instAwareProcessorManager;
    private getConstructorArgs;
    private propertyFactories;
    private lazyMode;
    private lifecycleResolver;
    constructor(componentClass: Newable<T>, container: ApplicationContext, instAwareProcessorManager: InstantiationAwareProcessorManager);
    appendLazyMode(lazyMode: boolean): void;
    private appendClassMetadata;
    build(): Instance<T>;
    private defineProperty;
    private createPropertiesGetterBuilder;
}
