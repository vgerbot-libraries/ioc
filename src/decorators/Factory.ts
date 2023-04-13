import { GlobalMetadata } from '../metadata/GlobalMetadata';
import { Newable } from '../types/Newable';
import { FactoryIdentifier } from '../types/FactoryIdentifier';
import { Instance } from '../types/Instance';
import { isNotDefined } from '../common/isNotDefined';

export function Factory(produceIdentifier?: FactoryIdentifier): MethodDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        const metadata = GlobalMetadata.getInstance();
        const clazz = target.constructor as Newable<Instance<unknown>>;

        if (isNotDefined(produceIdentifier)) {
            produceIdentifier = Reflect.getMetadata('design:returntype', target, propertyKey);
        }
        if (isNotDefined(produceIdentifier)) {
            throw new Error('The return type not recognized, cannot perform instance creation!');
        }
        const injections = Reflect.getMetadata('design:paramtypes', target, propertyKey);

        metadata.recordFactory(
            produceIdentifier,
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
