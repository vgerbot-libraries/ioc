import { Newable } from '../types/Newable';
import { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';
import { ApplicationContext } from './ApplicationContext';
import { Instance } from '../types/Instance';
export declare class InstantiationAwareProcessorManager {
    private readonly container;
    private instAwareProcessorClasses;
    private instAwareProcessorInstances;
    constructor(container: ApplicationContext);
    appendInstAwareProcessorClass(instAwareProcessorClass: Newable<PartialInstAwareProcessor>): void;
    appendInstAwareProcessorClasses(instAwareProcessorClasses: Set<Newable<PartialInstAwareProcessor>> | Array<Newable<PartialInstAwareProcessor>>): void;
    beforeInstantiation<T>(componentClass: Newable<T>, args: unknown[]): Instance<T> | undefined;
    afterInstantiation<T>(instance: Instance<T>): Instance<T>;
    isInstAwareProcessorClass(cls: Newable<unknown>): boolean;
    getInstAwareProcessorClasses(): Newable<PartialInstAwareProcessor>[];
}
