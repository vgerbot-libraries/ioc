import { Newable } from '../types/Newable';
import { Instance } from '../types/Instance';
import { ApplicationContext } from './ApplicationContext';
export declare class LifecycleManager<T = unknown> {
    private readonly componentClass;
    private readonly container;
    private classMetadataReader;
    constructor(componentClass: Newable<T>, container: ApplicationContext);
    invokePreInjectMethod(instance: Instance<T>): void;
    invokePostInjectMethod(instance: Instance<T>): void;
    invokePreDestroyInjectMethod(instance: Instance<T>): void;
    private invokeLifecycleMethods;
}
