import { InstanceScope } from '../foundation/InstanceScope';
import { Identifier } from './Identifier';

export interface JsServiceClass<T> extends Function {
    new (...args: any[]): T;
    scope?: () => InstanceScope;
    inject?: () => Record<string | symbol, Identifier>;
}
