import { InstanceScope } from '../guards/InstanceScope';

const CLASS_METADATA_KEY = 'ioc:class-metadata';

export class ClassMetadata {
    static record<TFunction extends Function>(target: TFunction) {
        const metadata = ClassMetadata.getMetadata(target);
        if (metadata) {
            return metadata;
        }
        const newMetadata = new ClassMetadata();
        Reflect.defineMetadata(CLASS_METADATA_KEY, newMetadata, target);
        return newMetadata;
    }
    static getMetadata<TFunction extends Function>(target: TFunction): ClassMetadata | undefined {
        return Reflect.getMetadata(CLASS_METADATA_KEY, target);
    }
    private scope: InstanceScope = InstanceScope.SINGLETON;
    private constructor() {
        // PASS
    }
    setScope(scope: InstanceScope) {
        this.scope = scope;
    }
    getScope() {
        return this.scope;
    }
}
