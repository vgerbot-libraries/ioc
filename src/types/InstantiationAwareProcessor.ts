import { Newable } from './Newable';

export interface InstantiationAwareProcessor {
    beforeInstantiation<T>(constructor: Newable<T>, args: unknown[]): T | undefined | void;
    afterInstantiation<T extends Object>(instance: T): T;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PartialInstAwareProcessor extends Partial<InstantiationAwareProcessor> {
    // PASS
}
