import { InstanceResolution } from '../types/InstanceResolution';

export class TransientInstanceResolution implements InstanceResolution {
    shouldGenerate(): boolean {
        return true;
    }

    getInstance<T>(): T | undefined {
        return;
    }

    saveInstance(): void {
        // PASS
    }
    destroy() {
        //
    }
}
