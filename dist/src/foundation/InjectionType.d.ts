import { Identifier } from '../types/Identifier';
import { Newable } from '../types/Newable';
export declare class InjectionType {
    readonly clazz: Newable<unknown>;
    readonly identifier: Identifier;
    static ofClazz(clazz: Newable<unknown>): InjectionType;
    static ofIdentifier(identifier: Identifier): InjectionType;
    static of(clazz: Newable<unknown>, identifier?: Identifier): InjectionType;
    private constructor();
    get isNewable(): boolean;
}
