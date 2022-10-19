import 'reflect-metadata';
import { Lifecycle } from '../foundation/Lifecycle';

export const METHOD_METADATA_KEY = Symbol('ioc:method-metadata');

export class MethodMetadata {
    static record<T>(target: T) {
        const metadata = MethodMetadata.getMetadata(target);
        if (metadata) {
            return metadata;
        }
        const newMetadata = new MethodMetadata();
        Reflect.defineMetadata(METHOD_METADATA_KEY, newMetadata, target);
        return newMetadata;
    }
    static getMetadata<T>(target: T): MethodMetadata | undefined {
        return Reflect.getMetadata(METHOD_METADATA_KEY, target);
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
}
