import { InstanceScope } from '../foundation/InstanceScope';
import { TaggedConstructor } from '../foundation/TaggedConstructor';
import { Metadata } from './Metadata';
import { ComponentContainer } from '../foundation/ComponentContainer';
import { DEFAULT_CONTAINER_ID } from '../foundation/consts';

const CLASS_METADATA_KEY = 'ioc:class-metadata';

export interface ClassMetadataReader {
    get scope(): InstanceScope;
    get container(): ComponentContainer;
}

export class ClassMetadata implements Metadata<ClassMetadataReader> {
    static getMetadata<TFunction extends Function>(target: TFunction): ClassMetadata {
        let metadata = ClassMetadata._getMetadata(target);
        if (!metadata) {
            const constr = target as unknown as TaggedConstructor;
            metadata = new ClassMetadata();
            if (typeof constr.scope === 'function') {
                metadata.setScope(constr.scope());
            }
            Reflect.defineMetadata(CLASS_METADATA_KEY, metadata, target);
        }
        return metadata;
    }
    private scope: InstanceScope = InstanceScope.SINGLETON;
    private container: ComponentContainer = ComponentContainer.getContainer(DEFAULT_CONTAINER_ID);
    private static _getMetadata<TFunction extends Function>(target: TFunction): ClassMetadata | undefined {
        return Reflect.getMetadata(CLASS_METADATA_KEY, target);
    }
    private constructor() {
        // PASS
    }
    setScope(scope: InstanceScope) {
        this.scope = scope;
    }
    setContainer(container: ComponentContainer) {
        this.container = container;
    }
    reader() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        return {
            get scope() {
                return that.scope;
            },
            get container() {
                return that.container;
            }
        };
    }
}
