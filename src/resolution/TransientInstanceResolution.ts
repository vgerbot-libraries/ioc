import { InstanceResolution } from '../types/InstanceResolution';
import { InstanceScope } from '../foundation/InstanceScope';

export class TransientInstanceResolution implements InstanceResolution {
    getScopeName(): string {
        return InstanceScope.TRANSIENT;
    }

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
