import { ApplicationContext } from '../foundation';
import { ClassMetadata, GlobalMetadata } from '../metadata';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';
import { Newable } from '../types';

export function Generate<T, V>(generator: (this: T, appCtx: ApplicationContext) => V): PropertyDecorator {
    return (target: Object | undefined, propertyKey: string | symbol | ClassMethodDecoratorContext<unknown>) => {
        if (target === undefined && typeof propertyKey === 'object') {
            const context = propertyKey;
            context.addInitializer(function (this: unknown) {
                defineGenerator(this as Newable<unknown>, context.name);
            });
        } else if (target && typeof propertyKey !== 'object') {
            defineGenerator(target.constructor as Newable<T>, propertyKey);
        }
    };
    function defineGenerator(clazz: Newable<unknown>, memberName: string | symbol) {
        const metadata = MetadataInstanceManager.getMetadata(clazz, ClassMetadata);
        const value_symbol = Symbol('@Generate-' + memberName.toString());
        metadata.recordPropertyType(memberName, value_symbol);
        GlobalMetadata.getInstance().recordFactory(value_symbol, (container, owner) => {
            return () => generator.call(owner as T, container);
        });
    }
}
