import { ServiceFactory } from '../types/ServiceFactory';
import { Identifier } from '../types/Identifier';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { ApplicationContext } from './ApplicationContext';

export class ServiceFactoryDef<T> {
    static createFromClassMetadata<T>(metadata: ClassMetadata<T>) {
        return new ServiceFactoryDef((container: ApplicationContext, owner: unknown) => {
            return () => {
                const reader = metadata.reader();
                const clazz = reader.getClass();
                return container.getInstance(clazz, owner);
            };
        });
    }
    constructor(public readonly factory: ServiceFactory<T, unknown>, public readonly injections?: Identifier[]) {}
}
