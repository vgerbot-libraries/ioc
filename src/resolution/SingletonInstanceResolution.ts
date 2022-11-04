import { GetInstanceOptions, InstanceResolution, SaveInstanceOptions } from '../types/InstanceResolution';

export class SingletonInstanceResolution implements InstanceResolution {
    private readonly INSTANCE_MAP = new Map();
    getInstance<T, O>(options: GetInstanceOptions<T, O>): T {
        return this.INSTANCE_MAP.get(options.identifier);
    }

    saveInstance<T, O>(options: SaveInstanceOptions<T, O>): void {
        this.INSTANCE_MAP.set(options.identifier, options.instance);
    }

    shouldGenerate<T, O>(options: GetInstanceOptions<T, O>): boolean {
        return !this.INSTANCE_MAP.has(options.identifier);
    }
    destroy() {
        //
    }
}
