import { Metadata } from '../types/Metadata';
import { Identifier } from '../types/Identifier';
import { ServiceFactory } from '../types/ServiceFactory';
import { FactoryIdentifier } from '../types/FactoryIdentifier';
import { ClassMetadata } from './ClassMetadata';
import { ServiceFactoryDef } from '../foundation/ServiceFactoryDef';

export interface GlobalMetadataReader {
    getComponentFactory<T>(key: FactoryIdentifier): ServiceFactoryDef<T> | undefined;
    getClassMetadata<T>(aliasName: string | symbol): ClassMetadata<T> | undefined;
}
export class GlobalMetadata implements Metadata<GlobalMetadataReader, void> {
    private static readonly INSTANCE = new GlobalMetadata();
    static getInstance() {
        return GlobalMetadata.INSTANCE;
    }
    private classAliasMetadataMap = new Map<string | symbol, ClassMetadata<unknown>>();
    private componentFactories = new Map<FactoryIdentifier, ServiceFactoryDef<unknown>>();
    recordFactory<T>(symbol: FactoryIdentifier, factory: ServiceFactory<T, unknown>, injections?: Identifier[]) {
        this.componentFactories.set(symbol, new ServiceFactoryDef(factory, injections));
    }
    recordClassAlias<T>(aliasName: string | symbol, metadata: ClassMetadata<T>) {
        this.classAliasMetadataMap.set(aliasName, metadata);
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
            }
        };
    }
}
