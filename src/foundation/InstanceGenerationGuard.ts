import { ComponentClass } from './ComponentClass';
import { Container } from './Container';

export abstract class InstanceGenerationGuard {
    abstract getScopeName(): string;

    abstract shouldGenerate<T>(container: Container, componentClass: ComponentClass<T>): boolean;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getContainer<T>(container: Container, componentClass: ComponentClass<T>) {
        return container;
    }
}
