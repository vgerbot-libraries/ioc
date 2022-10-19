import { InstanceGenerationGuard } from '../foundation/InstanceGenerationGuard';
import { Container, ROOT_CONTAINER } from '../foundation/Container';
import { ComponentClass } from '../foundation/ComponentClass';
import { InstanceScope } from './InstanceScope';

export class GlobalSharedInstanceGenerationGuard extends InstanceGenerationGuard {
    getScopeName(): string {
        return InstanceScope.GLOBAL_SHARED_SINGLETON;
    }

    shouldGenerate<T>(container: Container, componentClass: ComponentClass<T>): boolean {
        return false;
    }

    getContainer(): Container {
        return ROOT_CONTAINER;
    }
}
