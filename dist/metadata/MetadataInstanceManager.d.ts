import { Metadata, MetadataClass, MetadataReader } from '../types/Metadata';
import 'reflect-metadata';
type AnyMetadata = Metadata<MetadataReader, unknown>;
type AnyMetadataClass = MetadataClass<MetadataReader, unknown, AnyMetadata>;
export declare class MetadataInstanceManager {
    static getMetadata<R extends MetadataReader, T extends Object, M extends Metadata<R, T> = Metadata<R, T>>(target: T, metadataClass: MetadataClass<R, T, M>): M;
    static getAllInstanceof<M extends AnyMetadataClass>(metadataClass: M): AnyMetadata[];
}
export {};
