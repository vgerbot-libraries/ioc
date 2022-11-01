// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction<R = any, T = void> = (this: T, ...args: any[]) => R;
