export declare function recordProxyTarget<T extends object>(proxy: T, target: T): void;
export declare function getProxyTarget<T extends object>(proxy: T): T | undefined;
export declare function isProxyOf<T extends object>(proxy: T, target: T): boolean;
export declare function hasProxyRecord(obj: object): boolean;
