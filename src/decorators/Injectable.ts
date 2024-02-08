import { GlobalMetadata } from '../metadata';
import { Newable } from '../types';
import { Instance } from '../types/Instance';

export interface InjectableOptions {
    produce: string | symbol | Array<string | symbol>;
}

/**
 * This decorator is typically used to identify classes that need to be configured within the IoC container.
 * In most cases, @Injectable can be omitted unless explicit configuration is required.
 */
export function Injectable(options?: InjectableOptions): ClassDecorator {
    return <TFunction extends Function>(target: TFunction): TFunction | void => {
        if (typeof options?.produce === 'undefined') {
            return target;
        }
        const metadata = GlobalMetadata.getInstance();
        const produces = Array.isArray(options.produce) ? options.produce : [options.produce];
        produces.forEach(produce => {
            metadata.recordFactory(
                produce,
                (container, owner) => {
                    return () => {
                        const instance = container.getInstance(target as unknown as Newable<Instance<unknown>>, owner);
                        return instance;
                    };
                },
                [],
                false
            );
        });
        return target;
    };
}
