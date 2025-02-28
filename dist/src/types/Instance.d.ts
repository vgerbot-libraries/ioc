export type Instance<T = any> = T & Record<string | symbol, any | (() => void)>;
