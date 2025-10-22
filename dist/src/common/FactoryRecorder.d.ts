import { InstanceScope } from '../foundation/InstanceScope';
import { ServiceFactoryDef } from '../foundation/ServiceFactoryDef';
import { FactoryIdentifier } from '../types/FactoryIdentifier';
import { Identifier } from '../types/Identifier';
import type { ServiceFactory } from '../types/ServiceFactory';
export declare class FactoryRecorder {
    private factories;
    append<T>(identifier: FactoryIdentifier, factory: ServiceFactory<T, unknown>, injections?: Identifier[], scope?: InstanceScope | string): void;
    set(identifier: FactoryIdentifier, factoryDef: ServiceFactoryDef<unknown>): void;
    get<T>(identifier: FactoryIdentifier): ServiceFactoryDef<T> | undefined;
    iterator(): IterableIterator<[FactoryIdentifier, ServiceFactoryDef<unknown>]>;
}
