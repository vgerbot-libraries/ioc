import { Metadata, MetadataClass, MetadataReader } from '../types/Metadata';
import 'reflect-metadata';
import { createDefaultValueMap } from '../common/DefaultValueMap';

type AnyMetadata = Metadata<MetadataReader, unknown>;
type AnyMetadataClass = MetadataClass<MetadataReader, unknown, AnyMetadata>;

const metadataInstanceMap = createDefaultValueMap<AnyMetadataClass, Set<AnyMetadata>>(() => new Set());

export class MetadataInstanceManager {
    static getMetadata<R extends MetadataReader, T extends Object, M extends Metadata<R, T> = Metadata<R, T>>(
        target: T,
        metadataClass: MetadataClass<R, T, M>
    ) {
        const key = metadataClass.getReflectKey();
        let metadata = Reflect.getMetadata(key, target);
        if (!metadata) {
            metadata = new metadataClass();
            metadata.init(target);
            Reflect.defineMetadata(key, metadata, target);
            const instanceSet = metadataInstanceMap.get(metadataClass);
            instanceSet.add(metadata);
        }
        return metadata as M;
    }
    static getAllInstanceof<M extends AnyMetadataClass>(metadataClass: M) {
        return Array.from(metadataInstanceMap.get(metadataClass));
    }
}
