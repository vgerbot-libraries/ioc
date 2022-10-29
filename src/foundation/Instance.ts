export type Instance<T> = T & Record<string | symbol, () => void>;
