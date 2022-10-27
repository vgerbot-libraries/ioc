export type AnyFunction<T = any, R = any> = (this: T, ...args: unknown[]) => R;
