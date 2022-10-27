import { Metadata } from './Metadata';
import { TypeSymbol } from '../foundation/TypeSymbol';
import { ComponentClass } from '../foundation/ComponentClass';
import { ComponentFactory } from '../foundation/ComponentFactory';
import { Key } from '../types/Key';

export interface GlobalMetadataReader {
    getComponentFactory(key: TypeSymbol): ComponentFactory | null | undefined;
}
function createFactory(cls: ComponentClass): ComponentFactory {
    return (container, owner) => {
        return {
            value: container.getComponentInstance(cls, owner)
        };
    };
}
export class GlobalMetadata implements Metadata<GlobalMetadataReader> {
    private static readonly INSTANCE = new GlobalMetadata();
    static getInstance() {
        return GlobalMetadata.INSTANCE;
    }
    private classSymbolMap = new Map<ComponentClass, Set<Key>>();
    private componentFactories = new Map<Key, ComponentFactory>();
    recordClassSymbol(sbl: Key, cls: ComponentClass) {
        const symbols = this.classSymbolMap.get(cls) || new Set<Key>();
        symbols.add(sbl);
        this.recordFactory(sbl, createFactory(cls));
    }
    recordFactory(symbol: Key, factory: ComponentFactory) {
        this.componentFactories.set(symbol, factory);
    }
    reader() {
        return {
            getComponentFactory: (key: Key) => {
                if (typeof key === 'function') {
                    const symbols = Array.from(this.classSymbolMap.get(key) || []);
                    if (!symbols.length) {
                        return createFactory(key);
                    } else {
                        return this.componentFactories.get(symbols[0]);
                    }
                }
                return this.componentFactories.get(key);
            }
        };
    }
}
