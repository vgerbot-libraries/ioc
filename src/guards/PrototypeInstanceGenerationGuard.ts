import { InstanceGenerationGuard } from '../foundation/InstanceGenerationGuard';
import { InstanceScope } from '../foundation/InstanceScope';
import { ComponentClass } from '../foundation/ComponentClass';

export class PrototypeInstanceGenerationGuard implements InstanceGenerationGuard {
    getScopeName(): string {
        return InstanceScope.PROTOTYPE;
    }

    shouldGenerate(): boolean {
        return true;
    }

    getInstance<T>(cls: ComponentClass<T>): T | undefined {
        return;
    }

    saveInstance(instance: ComponentClass): void {
        // PASS
    }
    destroy() {
        //
    }
}
