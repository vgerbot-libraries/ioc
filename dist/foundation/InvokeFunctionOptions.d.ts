import { Identifier } from '../types/Identifier';
type InvokeFunctionArgs = {
    args?: unknown[];
};
type InvokeFunctionInjections = {
    injections: Identifier[];
};
type InvokeFunctionBasicOptions<T> = {
    context?: T;
};
export type InvokeFunctionOptions<T> = (InvokeFunctionBasicOptions<T> & InvokeFunctionArgs) | (InvokeFunctionBasicOptions<T> & Partial<InvokeFunctionInjections>);
export declare function hasArgs<T>(options: InvokeFunctionOptions<T>): options is InvokeFunctionBasicOptions<T> & InvokeFunctionArgs;
export declare function hasInjections<T>(options: InvokeFunctionOptions<T>): options is InvokeFunctionBasicOptions<T> & InvokeFunctionInjections;
export {};
