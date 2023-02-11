import { InstanceResolution, SaveInstanceOptions } from '../types/InstanceResolution';
import { invokePreDestroy } from '../common/invokePreDestroy';

export class TransientInstanceResolution implements InstanceResolution {
    private readonly instances = new Set<unknown>();
    shouldGenerate(): boolean {
        return true;
    }

    getInstance<T>(): T | undefined {
        return;
    }

    saveInstance<T, O>(options: SaveInstanceOptions<T, O>): void {
        this.instances.add(options.instance);
    }
    destroy() {
        this.instances.forEach(it => {
            if (!it) {
                return;
            }
            invokePreDestroy(it);
        });
        this.instances.clear();
    }
}
