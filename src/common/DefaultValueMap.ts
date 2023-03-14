export function createDefaultValueMap<K, V>(factory: (key: K) => V) {
    const map = new Map<K, V>();
    const originGet = map.get.bind(map);
    map.get = function (key: K) {
        if (map.has(key)) {
            return originGet(key) as V;
        } else {
            const defaultValue = factory(key);
            map.set(key, defaultValue);
            return map.get(key) as V;
        }
    };
    return map as DefaultValueMap<K, V>;
}
export type DefaultValueMap<K, V> = Omit<Map<K, V>, 'get'> & {
    get: (key: K) => V;
};
