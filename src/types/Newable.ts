// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Newable<T> = Function & { new (...args: any[]): T };
