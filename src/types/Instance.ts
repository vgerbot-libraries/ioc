// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Instance<T = any> = T & Record<string | symbol, any | (() => void)>;
