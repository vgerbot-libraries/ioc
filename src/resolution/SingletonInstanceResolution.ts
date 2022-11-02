import { InstanceResolution } from '../types/InstanceResolution';
import { Newable } from '../types/Newable';
import { Instance } from '../types/Instance';

export class SingletonInstanceResolution implements InstanceResolution {
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
