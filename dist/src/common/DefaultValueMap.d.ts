export declare function createDefaultValueMap<K, V>(factory: (key: K) => V): DefaultValueMap<K, V>;
export type DefaultValueMap<K, V> = Omit<Map<K, V>, 'get'> & {
    get: (key: K) => V;
};
