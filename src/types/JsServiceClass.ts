import { InstanceScope } from '../foundation/InstanceScope';
import { Identifier } from './Identifier';

export interface JsServiceClass<T> extends Function {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any[]): T;
    scope?: () => InstanceScope | string;
    inject?: () => Record<string | symbol, Identifier>;
}
