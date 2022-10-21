import { InstanceScope } from './InstanceScope';

export interface TaggedConstructor extends Function {
    scope(): InstanceScope;
}
