import { ServiceFactory } from '../types/ServiceFactory';
import { Identifier } from '../types/Identifier';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { ApplicationContext } from './ApplicationContext';
import { InstanceScope } from './InstanceScope';
export declare class ServiceFactoryDef<T> {
    readonly identifier: Identifier;
    readonly scope: InstanceScope | string;
    static createFromClassMetadata<T>(metadata: ClassMetadata<T>): ServiceFactoryDef<unknown>;
    readonly factories: Map<ServiceFactory<T, unknown>, Identifier<unknown>[]>;
    /**
     * @param identifier The unique identifier of this factories
     * @param isSingle Indicates whether the identifier defines only one factory.
     */
    constructor(identifier: Identifier, scope: InstanceScope | string);
    append(factory: ServiceFactory<T, unknown>, injections?: Identifier[]): void;
    produce(container: ApplicationContext, owner?: unknown): () => T[];
}
