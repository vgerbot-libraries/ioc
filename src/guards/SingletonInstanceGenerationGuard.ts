import { InstanceGenerationGuard } from '../foundation/InstanceGenerationGuard';
import { ComponentContainer } from '../foundation/Container';
import { ComponentClass } from '../foundation/ComponentClass';
import { InstanceScope } from '../foundation/InstanceScope';

export class SingletonInstanceGenerationGuard extends InstanceGenerationGuard {
    getScopeName() {
        return InstanceScope.SINGLETON;
    }
    shouldGenerate<T>(container: ComponentContainer, componentClass: ComponentClass<T>): boolean {
        return false;
    }
}
