import 'reflect-metadata';
import { Lifecycle } from '../foundation/Lifecycle';
import { Metadata } from './Metadata';

export const METHOD_METADATA_KEY = Symbol('ioc:method-metadata');

export interface MethodMetadataReader {
    getMethods(lifecycle: Lifecycle): Array<string | symbol>;
}

export class MethodMetadata implements Metadata<MethodMetadataReader> {
    static getMetadata<T extends Function>(target: T): MethodMetadata {
        let metadata = Reflect.getMetadata(METHOD_METADATA_KEY, target);
        if (!metadata) {
            metadata = new MethodMetadata();
            Reflect.defineMetadata(METHOD_METADATA_KEY, metadata, target);
        }
        return metadata;
    }
    private readonly lifecyclesMap: Record<string | symbol, Set<Lifecycle>> = {};
    private constructor() {
        // PASS
    }
    addLifecycle(methodName: string | symbol, lifecycle: Lifecycle) {
        const lifecycles = this.getLifecycles(methodName);
        lifecycles.add(lifecycle);
        this.lifecyclesMap[methodName] = lifecycles;
    }
    private getLifecycles(methodName: string | symbol) {
        return this.lifecyclesMap[methodName] || new Set<Lifecycle>();
    }
    getMethods(lifecycle: Lifecycle): Array<string | symbol> {
        return Object.keys(this.lifecyclesMap).filter(it => {
            const lifecycles = this.lifecyclesMap[it];
            return lifecycles.has(lifecycle);
        });
    }
    reader() {
        return {
            getMethods: (lifecycle: Lifecycle) => {
                return this.getMethods(lifecycle);
            }
        };
    }
}
