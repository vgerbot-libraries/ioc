import { InstanceGenerationGuard } from '../foundation/InstanceGenerationGuard';
import { ComponentContainer } from '../foundation/ComponentContainer';
import { ComponentClass } from '../foundation/ComponentClass';
import { InstanceScope } from '../foundation/InstanceScope';

export class GlobalSharedInstanceGenerationGuard extends InstanceGenerationGuard {
    getScopeName(): string {
        return InstanceScope.GLOBAL_SHARED_SINGLETON;
    }

    shouldGenerate<T, Owner>(container: ComponentContainer, componentClass: ComponentClass<T>, owner?: Owner): boolean {
        return false;
    }
}
