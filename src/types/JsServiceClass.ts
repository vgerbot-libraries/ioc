import { InstanceScope } from '../foundation/InstanceScope';
import { Identifier } from './Identifier';

export interface JsServiceClass<T> extends Function {
    new (...args: any[]): T;
    scope?: () => InstanceScope | string;
    inject?: () => Record<string | symbol, Identifier>;
}
