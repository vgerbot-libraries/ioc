import { InstanceScope } from './InstanceScope';
import { ComponentClass } from './ComponentClass';

export interface TaggedConstructor extends Function {
    scope(): InstanceScope;
    inject(): Record<string | symbol, ComponentClass<unknown>>;
}
