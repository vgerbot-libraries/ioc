import { Metadata, MetadataClass, MetadataReader } from './Metadata';

export class MetadataFactory {
    static getMetadata<M extends Metadata<MetadataReader>, T extends Object>(target: T, metadataClass: MetadataClass<M>) {
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
