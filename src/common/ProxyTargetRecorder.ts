const PROXY_TARGET_MAP = new WeakMap<object, object>();

export function recordProxyTarget<T extends object>(proxy: T, target: T): void {
    PROXY_TARGET_MAP.set(proxy, target);
}

export function getProxyTarget<T extends object>(proxy: T): T | undefined {
    return PROXY_TARGET_MAP.get(proxy) as T | undefined;
}

export function isProxyOf<T extends object>(proxy: T, target: T): boolean {
    return PROXY_TARGET_MAP.get(proxy) === target;
}

export function hasProxyRecord(obj: object): boolean {
    return PROXY_TARGET_MAP.has(obj);
}
