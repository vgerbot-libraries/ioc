import { GlobalMetadata } from '../metadata/GlobalMetadata';
import { Newable } from '../types/Newable';
import { FactoryIdentifier } from '../types/FactoryIdentifier';
import { Identifier } from '../types/Identifier';
import { Instance } from '../types/Instance';

export function Factory(identifier: FactoryIdentifier, injections: Identifier[] = []): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        const metadata = GlobalMetadata.getInstance();
        const clazz = target.constructor as Newable<Instance<unknown>>;

        metadata.recordFactory(
            identifier,
            (container, owner) => {
                const instance = container.getInstance(clazz, owner);
                const func = instance[propertyKey];
                if (typeof func === 'function') {
                    return (...args) => {
                        const instance = container.getInstance(clazz);
                        return func.apply(instance, args);
                    };
                } else {
                    return () => func;
                }
            },
            injections
        );
    };
}
