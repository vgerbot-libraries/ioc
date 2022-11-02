import { Newable } from './Newable';

export interface InstanceResolution {
    shouldGenerate<T, Owner>(componentClass: Newable<T>, owner?: Owner): boolean;

    saveInstance<T, Owner>(instance: T, owner?: Owner): void;

    getInstance<T, Owner>(cls: Newable<T>, owner?: Owner): T | undefined;

    destroy(): void;
}
