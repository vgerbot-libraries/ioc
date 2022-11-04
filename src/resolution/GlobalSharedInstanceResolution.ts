import { GetInstanceOptions, InstanceResolution, SaveInstanceOptions } from '../types/InstanceResolution';
import { SingletonInstanceResolution } from './SingletonInstanceResolution';

const SINGLETON_INSTANCE_SINGLETON = new SingletonInstanceResolution();

export class GlobalSharedInstanceResolution implements InstanceResolution {
    getInstance<T, O>(options: GetInstanceOptions<T, O>): T {
        return SINGLETON_INSTANCE_SINGLETON.getInstance(options);
    }

    saveInstance<T, O>(options: SaveInstanceOptions<T, O>): void {
        SINGLETON_INSTANCE_SINGLETON.saveInstance(options);
    }

    shouldGenerate<T, O>(options: GetInstanceOptions<T, O>): boolean {
        return SINGLETON_INSTANCE_SINGLETON.shouldGenerate(options);
    }
    destroy() {
        // PASS;
    }
}
