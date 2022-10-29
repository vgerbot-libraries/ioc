const NOT_INITIALIZED = {};
export function defineLazyProperty<T, V>(instance: T, propertyName: string | symbol, getter: () => V) {
    let _instance: unknown = NOT_INITIALIZED;
    Object.defineProperty(instance, propertyName, {
        get: () => {
            if (_instance === NOT_INITIALIZED) {
                _instance = getter();
            }
            return _instance;
        }
    });
}
