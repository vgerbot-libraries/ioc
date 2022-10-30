import { InstanceResolution } from '../types/InstanceResolution';
import { InstanceScope } from '../foundation/InstanceScope';
import { Newable } from '../types/Newable';

export class TransientInstanceResolution implements InstanceResolution {
    getScopeName(): string {
        return InstanceScope.TRANSIENT;
    }

    shouldGenerate(): boolean {
        return true;
    }

    getInstance<T>(cls: Newable<T>): T | undefined {
        return;
    }

    saveInstance<T>(instance: T): void {
        // PASS
    }
    destroy() {
        //
    }
}
