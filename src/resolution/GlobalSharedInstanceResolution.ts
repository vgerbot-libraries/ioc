import { InstanceResolution } from '../types/InstanceResolution';
import { Newable } from '../types/Newable';
import { InstanceScope } from '../foundation/InstanceScope';
import { SingletonInstanceResolution } from './SingletonInstanceResolution';

const SINGLETON_INSTANCE_SINGLETON = new SingletonInstanceResolution();

export class GlobalSharedInstanceResolution implements InstanceResolution {
    getScopeName(): string {
        return InstanceScope.GLOBAL_SHARED_SINGLETON;
    }

    getInstance<T>(cls: Newable<T>): T {
        return SINGLETON_INSTANCE_SINGLETON.getInstance(cls);
    }

    saveInstance<T>(instance: T): void {
        SINGLETON_INSTANCE_SINGLETON.saveInstance(instance);
    }

    shouldGenerate<T>(componentClass: Newable<T>): boolean {
        return SINGLETON_INSTANCE_SINGLETON.shouldGenerate(componentClass);
    }
    destroy() {
        // PASS;
    }
}
