import { Metadata, MetadataClass, MetadataReader } from '../types/Metadata';

export class MetadataFactory {
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
        }
        return metadata as M;
    }
}
