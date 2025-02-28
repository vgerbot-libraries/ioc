export type Newable<T> = Function & {
    new (...args: any[]): T;
};
