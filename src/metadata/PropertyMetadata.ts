import { Constructor } from '../foundation/Constructor';

export const PROPERTY_METADATA_KEY = 'metadata:property';

export class PropertyMetadata {
    static record<T>(target: T) {
        const metadata = PropertyMetadata.getMetadata(target);
        if (metadata) {
            return metadata;
        }
        const newMetadata = new PropertyMetadata();
        Reflect.defineMetadata(PROPERTY_METADATA_KEY, newMetadata, target);
        return newMetadata;
    }
    static getMetadata<T>(target: T) {
        return Reflect.getMetadata(PROPERTY_METADATA_KEY, target) as PropertyMetadata | undefined;
    }
    private constructorsMap: Record<string | symbol, Constructor<unknown>> = {};
    private constructor() {
        // PASS
    }
    recordPropertyConstructor<T>(key: string | symbol, constr: Constructor<T>) {
        this.constructorsMap[key] = constr;
    }
    getConstructor<T>(key: string | symbol): Constructor<T> {
        return this.constructorsMap[key] as Constructor<T>;
    }
    getInjectionProperties() {
        return Object.keys(this.constructorsMap);
    }
}
