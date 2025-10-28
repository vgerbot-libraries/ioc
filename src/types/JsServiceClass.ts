import { InstanceScope } from '../foundation/InstanceScope';
import { InjectionType } from '../foundation/InjectionType';

export interface JsServiceClass<T> extends Function {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any[]): T;
    scope?: () => InstanceScope | string;
    inject?: () => Record<string | symbol, InjectionType>;
    metadata?: () => {
        scope?: InstanceScope;
        inject: Record<string | symbol, InjectionType>;
    };
}
