import { InstanceGenerationGuard } from '../foundation/InstanceGenerationGuard';
import { Container } from '../foundation/Container';
import { ComponentClass } from '../foundation/ComponentClass';
import { InstanceScope } from './InstanceScope';

export class SingletonInstanceGenerationGuard extends InstanceGenerationGuard {
    getScopeName() {
        return InstanceScope.SINGLETON;
    }
    shouldGenerate<T>(container: Container, componentClass: ComponentClass<T>): boolean {
        return false;
    }
}
