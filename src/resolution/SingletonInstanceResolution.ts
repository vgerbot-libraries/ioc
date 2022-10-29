import { InstanceResolution } from '../foundation/InstanceResolution';
import { Newable } from '../foundation/Newable';
import { InstanceScope } from '../foundation/InstanceScope';
import { Instance } from '../foundation/Instance';

export class SingletonInstanceResolution implements InstanceResolution {
    getScopeName() {
        return InstanceScope.SINGLETON;
    }
    private readonly INSTANCE_MAP = new Map();
    getInstance<T>(cls: Newable<T>): T {
        return this.INSTANCE_MAP.get(cls);
    }

    saveInstance<T>(instance: T): void {
        this.INSTANCE_MAP.set((instance as Instance<T>).constructor, instance);
    }

    shouldGenerate<T>(componentClass: Newable<T>): boolean {
        return !this.INSTANCE_MAP.has(componentClass);
    }
    destroy() {
        //
    }
}
