import { Newable } from './Newable';

export interface Metadata<R extends MetadataReader, Target> {
    init(target: Target): void;
    reader(): R;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MetadataReader {
    // EMPTY
}
export type MetadataClass<R extends MetadataReader, T, M extends Metadata<R, T>> = Newable<M> & {
    prototype: M;
    getReflectKey(): string | symbol;
};
