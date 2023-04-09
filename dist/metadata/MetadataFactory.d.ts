import { Metadata, MetadataClass, MetadataReader } from '../types/Metadata';
import 'reflect-metadata';
export declare class MetadataFactory {
    static getMetadata<R extends MetadataReader, T extends Object, M extends Metadata<R, T> = Metadata<R, T>>(target: T, metadataClass: MetadataClass<R, T, M>): M;
}
