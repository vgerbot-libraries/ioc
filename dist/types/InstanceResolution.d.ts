import { Identifier } from './Identifier';
export interface SaveInstanceOptions<T, O> {
    identifier: Identifier<T>;
    instance: T;
    owner?: O;
    ownerPropertyKey?: keyof O;
}
export interface GetInstanceOptions<T, O> {
    identifier: Identifier<T>;
    owner?: O;
    ownerPropertyKey?: keyof O;
}
export interface InstanceResolution {
    shouldGenerate<T, Owner>(options: GetInstanceOptions<T, Owner>): boolean;
    saveInstance<T, Owner>(options: SaveInstanceOptions<T, Owner>): void;
    getInstance<T, Owner>(options: GetInstanceOptions<T, Owner>): T | undefined;
    destroy(): void;
}
