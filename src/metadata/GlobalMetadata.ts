import { Metadata } from './Metadata';
import { Identifier } from '../foundation/Identifier';
import { ServiceFactory } from '../foundation/ServiceFactory';
import { FactoryIdentifier } from '../types/FactoryIdentifier';
import { ClassMetadata } from './ClassMetadata';
import { FactoryDef } from '../types/FactoryDef';

export interface GlobalMetadataReader {
    getComponentFactory<T>(key: Identifier): FactoryDef<T> | undefined;
    getClassMetadata(aliasName: string | symbol): ClassMetadata | undefined;
}
export class GlobalMetadata implements Metadata<GlobalMetadataReader> {
    private static readonly INSTANCE = new GlobalMetadata();
    static getInstance() {
        return GlobalMetadata.INSTANCE;
    }
    private classAliasMetadataMap = new Map<string | symbol, ClassMetadata>();
    private componentFactories = new Map<FactoryIdentifier, FactoryDef<any>>();
    recordFactory<T>(symbol: FactoryIdentifier, factory: ServiceFactory<T>, injections?: Identifier[]) {
        this.componentFactories.set(symbol, new FactoryDef(factory, injections));
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
