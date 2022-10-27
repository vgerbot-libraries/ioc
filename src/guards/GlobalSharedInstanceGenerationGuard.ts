import { InstanceGenerationGuard } from '../foundation/InstanceGenerationGuard';
import { ComponentClass } from '../foundation/ComponentClass';
import { InstanceScope } from '../foundation/InstanceScope';
import { SingletonInstanceGenerationGuard } from './SingletonInstanceGenerationGuard';

const SINGLETON_INSTANCE_SINGLETON = new SingletonInstanceGenerationGuard();

export class GlobalSharedInstanceGenerationGuard implements InstanceGenerationGuard {
    getScopeName(): string {
        return InstanceScope.GLOBAL_SHARED_SINGLETON;
    }

    getInstance<T>(cls: ComponentClass<T>): T {
        return SINGLETON_INSTANCE_SINGLETON.getInstance(cls);
    }

    saveInstance(instance: ComponentClass): void {
        SINGLETON_INSTANCE_SINGLETON.saveInstance(instance);
    }

    shouldGenerate<T>(componentClass: ComponentClass<T>): boolean {
        return SINGLETON_INSTANCE_SINGLETON.shouldGenerate(componentClass);
    }
    destroy() {
        // PASS;
    }
}
