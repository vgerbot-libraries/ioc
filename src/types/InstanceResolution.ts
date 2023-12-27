import { Identifier } from './Identifier';
import { KeyOf } from './KeyOf';

export interface SaveInstanceOptions<T, O> {
    identifier: Identifier<T>;
    instance: T;
    owner?: O;
    ownerPropertyKey?: KeyOf<T>;
}

export interface GetInstanceOptions<T, O> {
    identifier: Identifier<T>;
    owner?: O;
    ownerPropertyKey?: KeyOf<T>;
}

export interface InstanceResolution {
    shouldGenerate<T, Owner>(options: GetInstanceOptions<T, Owner>): boolean;

    saveInstance<T, Owner>(options: SaveInstanceOptions<T, Owner>): void;

    getInstance<T, Owner>(options: GetInstanceOptions<T, Owner>): T | undefined;

    destroy(): void;
}
