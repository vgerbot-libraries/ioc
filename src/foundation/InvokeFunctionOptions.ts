import { Identifier } from './Identifier';

type InvokeFunctionArgs = {
    args?: unknown[];
};
type InvokeFunctionInjections = {
    injections?: Identifier[];
};

type InvokeFunctionBasicOptions<T> = {
    context?: T;
};

export type InvokeFunctionOptions<T> =
    | (InvokeFunctionBasicOptions<T> & InvokeFunctionArgs)
    | (InvokeFunctionBasicOptions<T> & InvokeFunctionInjections);

export function hasArgs<T>(options: InvokeFunctionOptions<T>): options is InvokeFunctionBasicOptions<T> & InvokeFunctionArgs {
    return 'args' in options;
}

export function hasInjections<T>(
    options: InvokeFunctionOptions<T>
): options is InvokeFunctionBasicOptions<T> & InvokeFunctionInjections {
    return 'injections' in options;
}
