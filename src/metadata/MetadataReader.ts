import { ComponentClass } from '../foundation/ComponentClass';
import { ClassMetadata } from './ClassMetadata';
import { MethodMetadata } from './MethodMetadata';
import { PropertyMetadata } from './PropertyMetadata';

const READERS_INSTANCE_CACHE = new WeakMap<ComponentClass<unknown>, MetadataReader>();

export class MetadataReader {
    static getMetadataReader<T extends ComponentClass<unknown>>(cls: T) {
        if (!READERS_INSTANCE_CACHE.has(cls)) {
            READERS_INSTANCE_CACHE.set(cls, new MetadataReader(cls));
        }
        return READERS_INSTANCE_CACHE.get(cls);
    }
    private readonly classMetadata: ClassMetadata;
    private readonly methodMetadata: MethodMetadata;
    private readonly propertyMetadata: PropertyMetadata;
    constructor(cls: ComponentClass<unknown>) {
        this.classMetadata = ClassMetadata.getMetadata(cls);
        this.methodMetadata = MethodMetadata.getMetadata(cls);
        this.propertyMetadata = PropertyMetadata.getMetadata(cls);
    }
    getClassMetadata() {
        return this.classMetadata.reader();
    }
    getMethodMetadata() {
        return this.methodMetadata.reader();
    }
    getPropertyMetadata() {
        return this.propertyMetadata.reader();
    }
}
