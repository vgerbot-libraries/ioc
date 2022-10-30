import { Newable } from './Newable';

export interface InstanceResolution {
    getScopeName(): string;

    shouldGenerate<T, Owner>(componentClass: Newable<T>, owner?: Owner): boolean;

    saveInstance<T>(instance: T): void;

    getInstance<T, Owner>(cls: Newable<T>, owner?: Owner): T | undefined;

    destroy(): void;
}
