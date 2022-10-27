import { ComponentClass } from './ComponentClass';

export interface InstanceGenerationGuard {
    getScopeName(): string;

    shouldGenerate<T, Owner>(componentClass: ComponentClass<T>, owner?: Owner): boolean;

    saveInstance(instance: ComponentClass): void;

    getInstance<T, Owner>(cls: ComponentClass<T>, owner?: Owner): T | undefined;

    destroy(): void;
}
