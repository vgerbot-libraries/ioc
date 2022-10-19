import { InstanceGenerationGuard } from '../foundation/InstanceGenerationGuard';
import { Container } from '../foundation/Container';
import { ComponentClass } from '../foundation/ComponentClass';
import { InstanceScope } from './InstanceScope';

export class SubtreeSingletonInstanceGenerationGuard extends InstanceGenerationGuard {
    getScopeName(): string {
        return InstanceScope.SUBTREE_SHARED_SINGLETON;
    }

    shouldGenerate<T>(container: Container, componentClass: ComponentClass<T>): boolean {
        return false;
    }

    getContainer<T>(container: Container, componentClass: ComponentClass<T>): Container {
        return super.getContainer(container, componentClass);
    }
}
