import { Metadata } from '../types/Metadata';
import { Identifier } from '../types/Identifier';
import { ServiceFactory } from '../types/ServiceFactory';
import { FactoryIdentifier } from '../types/FactoryIdentifier';
import { ClassMetadata } from './ClassMetadata';
import { ServiceFactoryDef } from '../foundation/ServiceFactoryDef';

export interface GlobalMetadataReader {
    getComponentFactory<T>(key: Identifier): ServiceFactoryDef<T> | undefined;
    getClassMetadata(aliasName: string | symbol): ClassMetadata | undefined;
}
export class GlobalMetadata implements Metadata<GlobalMetadataReader> {
    private static readonly INSTANCE = new GlobalMetadata();
    static getInstance() {
        return GlobalMetadata.INSTANCE;
    }
    private classAliasMetadataMap = new Map<string | symbol, ClassMetadata>();
    private componentFactories = new Map<FactoryIdentifier, ServiceFactoryDef<any>>();
    recordFactory<T>(symbol: FactoryIdentifier, factory: ServiceFactory<T>, injections?: Identifier[]) {
        this.componentFactories.set(symbol, new ServiceFactoryDef(factory, injections));
    }
    recordClassAlias(aliasName: string | symbol, metadata: ClassMetadata) {
        this.classAliasMetadataMap.set(aliasName, metadata);
    }
    init() {
        // PASS;
    }
    reader() {
        return {
            getComponentFactory: (key: FactoryIdentifier) => {
                return this.componentFactories.get(key);
            },
            getClassMetadata: (aliasName: string | symbol): ClassMetadata | undefined => {
                return this.classAliasMetadataMap.get(aliasName);
            }
        };
    }
}
