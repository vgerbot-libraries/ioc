import { ApplicationContext } from '../foundation';
import { ClassMetadata, GlobalMetadata } from '../metadata';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';

export function Generate<T, V>(generator: (this: T, appCtx: ApplicationContext) => V): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        const metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
        const value_symbol = Symbol('');
        metadata.recordPropertyType(propertyKey, value_symbol);
        GlobalMetadata.getInstance().recordFactory(value_symbol, (container, owner) => {
            return () => generator.call(owner as T, container);
        });
    };
}
