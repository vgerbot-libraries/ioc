import { Newable } from '../types/Newable';

function getMethodDescriptors(prototype: object): Record<string, PropertyDescriptor> {
    if (typeof prototype !== 'object' || prototype === null) {
        return {};
    }
    const superPrototype = Object.getPrototypeOf(prototype);
    const superDescriptors = superPrototype === prototype ? {} : getMethodDescriptors(superPrototype);
    return Object.assign(superDescriptors, Object.getOwnPropertyDescriptors(prototype));
}

export function getAllMethodMemberNames<T>(cls: Newable<T>) {
    const descriptors = getMethodDescriptors(cls.prototype);
    const methodNames = new Set<string>();
    for (const key in descriptors) {
        const member = cls.prototype[key];
        if (typeof member === 'function') {
            methodNames.add(key);
        }
    }
    return methodNames;
}
