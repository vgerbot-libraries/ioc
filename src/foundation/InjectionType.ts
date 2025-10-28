import { Identifier } from '../types/Identifier';
import { Newable } from '../types/Newable';

export class InjectionType {
    static ofClazz(clazz: Newable<unknown>) {
        return new InjectionType(clazz);
    }
    static ofIdentifier(identifier: Identifier) {
        return new InjectionType(Object as unknown as Newable<unknown>, identifier);
    }
    static of(clazz: Newable<unknown>, identifier: Identifier = clazz) {
        return new InjectionType(clazz, identifier);
    }
    private constructor(public readonly clazz: Newable<unknown>, public readonly identifier: Identifier = clazz) {}

    get isNewable() {
        return this.identifier === this.clazz;
    }
}
