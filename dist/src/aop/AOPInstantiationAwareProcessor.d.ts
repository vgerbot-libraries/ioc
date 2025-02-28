import { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';
import type { ApplicationContext } from '../foundation/ApplicationContext';
import { Newable } from '../types/Newable';
export declare abstract class AOPInstantiationAwareProcessor implements PartialInstAwareProcessor {
    static create(appCtx: ApplicationContext): Newable<AOPInstantiationAwareProcessor>;
    protected abstract readonly appCtx: ApplicationContext;
    afterInstantiation<T extends object>(instance: T): T;
}
