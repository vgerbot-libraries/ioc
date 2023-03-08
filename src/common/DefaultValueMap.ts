export class DefaultValueMap<K, V> implements Map<K, V> {
    private readonly map = new Map<K, V>();
    constructor(private factory: (key: K) => V) {}
    get(key: K) {
        if (this.map.has(key)) {
            try {
                return this.map.get(key) as V;
            } catch (e) {
                console.error('super.get throw error', e);
                throw e;
            }
        } else {
            const defaultValue = this.factory(key);
            this.map.set(key, defaultValue);
            return this.map.get(key) as V;
        }
    }

    get [Symbol.toStringTag](): string {
        return this.map[Symbol.toStringTag];
    }
    get size() {
        return this.map.size;
    }

    [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.map[Symbol.iterator]();
    }

    clear(): void {
        this.map.clear();
    }

    delete(key: K): boolean {
        return this.map.delete(key);
    }

    entries(): IterableIterator<[K, V]> {
        return this.map.entries();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
        this.map.forEach(callbackfn, thisArg);
    }

    has(key: K): boolean {
        return this.map.has(key);
    }

    keys(): IterableIterator<K> {
        return this.map.keys();
    }

    set(key: K, value: V): this {
        this.map.set(key, value);
        return this;
    }

    values(): IterableIterator<V> {
        return this.map.values();
    }
}
