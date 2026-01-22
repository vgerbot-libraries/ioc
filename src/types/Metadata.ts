import type { Newable } from './Newable';

export interface Metadata<R extends MetadataReader, Target> {
    init(target: Target): void;
    reader(): R;
}

export type MetadataReader = {};
export type MetadataClass<R extends MetadataReader, T, M extends Metadata<R, T>> = Newable<M> & {
    prototype: M;
    getReflectKey(): string | symbol;
};
