import { ServiceFactory } from '../types/ServiceFactory';
import { Identifier } from '../types/Identifier';
import { ClassMetadata } from '../metadata/ClassMetadata';
export declare class ServiceFactoryDef<T> {
    readonly factory: ServiceFactory<T, unknown>;
    readonly injections?: Identifier<unknown>[] | undefined;
    static createFromClassMetadata<T>(metadata: ClassMetadata<T>): ServiceFactoryDef<T>;
    constructor(factory: ServiceFactory<T, unknown>, injections?: Identifier<unknown>[] | undefined);
}
