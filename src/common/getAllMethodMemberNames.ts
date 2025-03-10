import { Newable } from '../types/Newable';

function getMethodDescriptors(prototype: object): Record<string, PropertyDescriptor> {
    if (
        typeof prototype !== 'object' ||
        prototype === null ||
        Object.prototype === prototype ||
        Function.prototype === prototype
    ) {
        return {};
    }
    const superPrototype = Object.getPrototypeOf(prototype);
    const superDescriptors = superPrototype === prototype ? {} : getMethodDescriptors(superPrototype);
    return Object.assign(superDescriptors, Object.getOwnPropertyDescriptors(prototype));
}

export function getAllMethodMemberNames<T>(cls: Newable<T>) {
    const descriptors = getMethodDescriptors(cls.prototype);
    delete descriptors['constructor'];
    const methodNames = new Set<string | symbol>();
    Reflect.ownKeys(descriptors).forEach(key => {
        const member = cls.prototype[key];
        if (typeof member === 'function') {
            methodNames.add(key);
        }
    });
    return methodNames;
}
