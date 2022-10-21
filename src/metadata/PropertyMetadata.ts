import { ComponentClass } from '../foundation/ComponentClass';
import { Metadata } from './Metadata';
import { TaggedConstructor } from '../foundation/TaggedConstructor';

export const PROPERTY_METADATA_KEY = 'ioc:metadata-property';

export interface PropertyMetadataReader {
    getConstructor<T>(key: string | symbol): ComponentClass<T>;
    get properties(): string[];
}

export class PropertyMetadata implements Metadata<PropertyMetadataReader> {
    static getMetadata<T extends Function>(target: T): PropertyMetadata {
        let metadata = PropertyMetadata._getMetadata(target);
        if (!metadata) {
            metadata = new PropertyMetadata();
            Reflect.defineMetadata(PROPERTY_METADATA_KEY, metadata, target);
            const constr = target as unknown as TaggedConstructor;
            if (typeof constr.inject === 'function') {
                const injects = constr.inject();
                for (const key in injects) {
                    metadata.recordPropertyConstructor(key, injects[key]);
                }
            }
        }
        return metadata;
    }
    private static _getMetadata<T extends Function>(target: T): PropertyMetadata | undefined {
        return Reflect.getMetadata(PROPERTY_METADATA_KEY, target);
    }
    private constructorsMap: Record<string | symbol, ComponentClass<unknown>> = {};
    constructor() {
        // PASS
    }
    recordPropertyConstructor<T>(key: string | symbol, constr: ComponentClass<T>) {
        this.constructorsMap[key] = constr;
    }
    getConstructor<T>(key: string | symbol): ComponentClass<T> {
        return this.constructorsMap[key] as ComponentClass<T>;
    }
    getInjectionProperties() {
        return Object.keys(this.constructorsMap);
    }
    reader() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        return {
            getConstructor<T>(key: string | symbol) {
                return that.getConstructor<T>(key);
            },
            get properties() {
                return that.getInjectionProperties();
            }
        };
    }
}
