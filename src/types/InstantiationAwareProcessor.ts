import { Newable } from './Newable';

export interface InstantiationAwareProcessor {
    beforeInstantiation<T>(constructor: Newable<T>, args: unknown[]): T | undefined;
    afterInstantiation<T>(instance: T): boolean;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PartialInstAwareProcessor extends Partial<InstantiationAwareProcessor> {
    // PASS
}
