import { InstanceGenerationGuard } from '../foundation/InstanceGenerationGuard';
import { ComponentClass } from '../foundation/ComponentClass';
import { InstanceScope } from '../foundation/InstanceScope';

export class SingletonInstanceGenerationGuard implements InstanceGenerationGuard {
    getScopeName() {
        return InstanceScope.SINGLETON;
    }
    private readonly INSTANCE_MAP = new Map();
    getInstance<T>(cls: ComponentClass<T>): T {
        return this.INSTANCE_MAP.get(cls);
    }

    saveInstance(instance: ComponentClass): void {
        this.INSTANCE_MAP.set(instance.constructor, instance);
    }

    shouldGenerate<T>(componentClass: ComponentClass<T>): boolean {
        return !this.INSTANCE_MAP.has(componentClass);
    }
    destroy() {
        //
    }
}
