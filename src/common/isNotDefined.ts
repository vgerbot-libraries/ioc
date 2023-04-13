export function isNull(value: unknown): value is null {
    return value === null;
}
export function isUndefined(value: unknown): value is undefined {
    return value === undefined;
}
export function isNotDefined<T>(value: T | undefined | null): value is undefined | null {
    return isNull(value) || isUndefined(value);
}
