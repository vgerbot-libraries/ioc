export class DefaultValueMap<K, V> extends Map<K, V> {
    constructor(private factory: (key: K) => V) {
        super();
    }
    get(key: K) {
        if (this.has(key)) {
            return super.get(key) as V;
        } else {
            const defaultValue = this.factory(key);
            this.set(key, defaultValue);
            return super.get(key) as V;
        }
    }
}
