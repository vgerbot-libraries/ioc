import { Metadata } from '../types/Metadata';
import { Identifier } from '../types/Identifier';
import { ServiceFactory } from '../types/ServiceFactory';
import { FactoryIdentifier } from '../types/FactoryIdentifier';
import { ClassMetadata } from './ClassMetadata';
import { ServiceFactoryDef } from '../foundation/ServiceFactoryDef';
import { Newable } from '../types/Newable';
import { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';
import { InstanceScope } from '../foundation/InstanceScope';
export interface GlobalMetadataReader {
    getComponentFactory<T>(key: FactoryIdentifier): ServiceFactoryDef<T> | undefined;
    getClassMetadata<T>(aliasName: string | symbol): ClassMetadata<T> | undefined;
    getInstAwareProcessorClasses(): Array<Newable<PartialInstAwareProcessor>>;
}
export declare class GlobalMetadata implements Metadata<GlobalMetadataReader, void> {
    private static readonly INSTANCE;
    static getInstance(): GlobalMetadata;
    static getReader(): {
        getComponentFactory: <T>(key: FactoryIdentifier) => ServiceFactoryDef<T> | undefined;
        getClassMetadata: <T_1>(aliasName: string | symbol) => ClassMetadata<T_1> | undefined;
        getInstAwareProcessorClasses: () => Newable<PartialInstAwareProcessor>[];
    };
    private classAliasMetadataMap;
    private componentFactories;
    private readonly processorClasses;
    recordFactory<T>(symbol: FactoryIdentifier, factory: ServiceFactory<T, unknown>, injections?: Identifier[], scope?: InstanceScope | string): void;
    recordClassAlias<T>(aliasName: string | symbol, metadata: ClassMetadata<T>): void;
    recordProcessorClass(clazz: Newable<PartialInstAwareProcessor>): void;
    init(): void;
    reader(): {
        getComponentFactory: <T>(key: FactoryIdentifier) => ServiceFactoryDef<T> | undefined;
        getClassMetadata: <T_1>(aliasName: string | symbol) => ClassMetadata<T_1> | undefined;
        getInstAwareProcessorClasses: () => Array<Newable<PartialInstAwareProcessor>>;
    };
}
