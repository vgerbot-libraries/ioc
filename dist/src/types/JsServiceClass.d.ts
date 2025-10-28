import { InstanceScope } from '../foundation/InstanceScope';
import { InjectionType } from '../foundation/InjectionType';
export interface JsServiceClass<T> extends Function {
    new (...args: any[]): T;
    scope?: () => InstanceScope | string;
    inject?: () => Record<string | symbol, InjectionType>;
    metadata?: () => {
        scope?: InstanceScope;
        inject: Record<string | symbol, InjectionType>;
    };
}
