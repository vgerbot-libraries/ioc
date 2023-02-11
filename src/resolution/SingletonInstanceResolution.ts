import { GetInstanceOptions, InstanceResolution, SaveInstanceOptions } from '../types/InstanceResolution';
import { Identifier } from '../types/Identifier';
import { ComponentInstanceWrapper } from '../foundation/ComponentInstanceWrapper';
import { invokePreDestroy } from '../common/invokePreDestroy';

export class SingletonInstanceResolution implements InstanceResolution {
    private readonly INSTANCE_MAP = new Map<Identifier, ComponentInstanceWrapper>();
    getInstance<T, O>(options: GetInstanceOptions<T, O>): T {
        return this.INSTANCE_MAP.get(options.identifier)?.instance as T;
    }

    saveInstance<T, O>(options: SaveInstanceOptions<T, O>): void {
        this.INSTANCE_MAP.set(options.identifier, new ComponentInstanceWrapper(options.instance));
    }

    shouldGenerate<T, O>(options: GetInstanceOptions<T, O>): boolean {
        return !this.INSTANCE_MAP.has(options.identifier);
    }
    destroy() {
        const instanceWrappers = Array.from(this.INSTANCE_MAP.values());
        instanceWrappers.sort((a, b) => a.compareTo(b));
        instanceWrappers.forEach(instanceWrapper => {
            invokePreDestroy(instanceWrapper.instance);
        });
        this.INSTANCE_MAP.clear();
    }
}
