import { Newable } from './Newable';

export interface Metadata<T extends MetadataReader> {
    init<T>(target: T): void;
    reader(): T;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MetadataReader {
    // EMPTY
}
export type MetadataClass<T extends Metadata<MetadataReader>> = Newable<T> & {
    getReflectKey(): string | symbol;
};
