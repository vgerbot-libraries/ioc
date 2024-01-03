import { Metadata } from '../types/Metadata';
import { Identifier } from '../types/Identifier';
import { ServiceFactory } from '../types/ServiceFactory';
import { FactoryIdentifier } from '../types/FactoryIdentifier';
import { ClassMetadata } from './ClassMetadata';
import { ServiceFactoryDef } from '../foundation/ServiceFactoryDef';
import { Newable } from '../types/Newable';
import { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';

export interface GlobalMetadataReader {
    getComponentFactory<T>(key: FactoryIdentifier): ServiceFactoryDef<T> | undefined;
    getClassMetadata<T>(aliasName: string | symbol): ClassMetadata<T> | undefined;
    getInstAwareProcessorClasses(): Array<Newable<PartialInstAwareProcessor>>;
}
export class GlobalMetadata implements Metadata<GlobalMetadataReader, void> {
    private static readonly INSTANCE = new GlobalMetadata();
    static getInstance() {
        return GlobalMetadata.INSTANCE;
    }
    static getReader() {
        return this.getInstance().reader();
    }
    private classAliasMetadataMap = new Map<string | symbol, ClassMetadata<unknown>>();
    private componentFactories = new Map<FactoryIdentifier, ServiceFactoryDef<unknown>>();
    private readonly processorClasses: Set<Newable<PartialInstAwareProcessor>> = new Set();
    recordFactory<T>(symbol: FactoryIdentifier, factory: ServiceFactory<T, unknown>, injections?: Identifier[]) {
        this.componentFactories.set(symbol, new ServiceFactoryDef(factory, injections));
    }
    recordClassAlias<T>(aliasName: string | symbol, metadata: ClassMetadata<T>) {
        this.classAliasMetadataMap.set(aliasName, metadata);
    }
    recordProcessorClass(clazz: Newable<PartialInstAwareProcessor>) {
        this.processorClasses.add(clazz);
    }
    init() {
        // PASS;
    }
    reader() {
        return {
            getComponentFactory: <T>(key: FactoryIdentifier): ServiceFactoryDef<T> | undefined => {
                return this.componentFactories.get(key) as ServiceFactoryDef<T> | undefined;
            },
            getClassMetadata: <T>(aliasName: string | symbol): ClassMetadata<T> | undefined => {
                return this.classAliasMetadataMap.get(aliasName) as ClassMetadata<T> | undefined;
            },
            getInstAwareProcessorClasses: (): Array<Newable<PartialInstAwareProcessor>> => {
                return Array.from(this.processorClasses);
            }
        };
    }
}
