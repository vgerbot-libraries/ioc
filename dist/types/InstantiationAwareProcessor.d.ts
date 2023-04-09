import { Newable } from './Newable';
export interface InstantiationAwareProcessor {
    beforeInstantiation<T>(constructor: Newable<T>, args: unknown[]): T | undefined | void;
    afterInstantiation<T extends Object>(instance: T): T;
}
export interface PartialInstAwareProcessor extends Partial<InstantiationAwareProcessor> {
}
