import { ComponentClass } from './ComponentClass';
import { ComponentContainer } from './ComponentContainer';

export abstract class InstanceGenerationGuard {
    abstract getScopeName(): string;

    abstract shouldGenerate<T, Owner>(container: ComponentContainer, componentClass: ComponentClass<T>, owner?: Owner): boolean;
}
