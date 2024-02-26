import { Newable } from '../types/Newable';
import { Identifier } from '../types/Identifier';
type MemberIdentifier = string | symbol;
export declare abstract class Pointcut {
    static combine(...pointcuts: Pointcut[]): OrPointcut;
    static of<T>(cls: Newable<T>, ...methodNames: MemberIdentifier[]): PrecitePointcut;
    /**
     * @deprecated
     */
    static testMatch<T>(cls: Newable<T>, regex: RegExp): MemberMatchPointcut;
    static match<T>(cls: Newable<T>, regex: RegExp): MemberMatchPointcut;
    static from(...classes: Array<Newable<unknown>>): {
        of: (...methodNames: MemberIdentifier[]) => OrPointcut;
        match: (regex: RegExp) => OrPointcut;
        /**
         * @deprecated
         */
        testMatch: (regex: RegExp) => OrPointcut;
    };
    static marked(type: string | symbol, value?: unknown): MarkedPointcut;
    static class<T>(cls: Newable<T>): ClassPointcut;
    abstract test(jpIdentifier: Identifier, jpMember: string | symbol): boolean;
}
declare class OrPointcut extends Pointcut {
    private pointcuts;
    constructor(pointcuts: Pointcut[]);
    test(jpIdentifier: Identifier, jpMember: string | symbol): boolean;
}
declare class PrecitePointcut extends Pointcut {
    private readonly methodEntries;
    constructor(methodEntries: Map<Identifier, Set<MemberIdentifier>>);
    test(jpIdentifier: Identifier, jpMember: string | symbol): boolean;
}
declare class MarkedPointcut extends Pointcut {
    private markedType;
    private markedValue;
    constructor(markedType: string | symbol, markedValue?: unknown);
    test(jpIdentifier: Identifier, jpMember: string | symbol): boolean;
}
declare class MemberMatchPointcut extends Pointcut {
    private clazz;
    private regex;
    constructor(clazz: Newable<unknown>, regex: RegExp);
    test(jpIdentifier: Identifier, jpMember: string | symbol): boolean;
}
declare class ClassPointcut extends Pointcut {
    private clazz;
    constructor(clazz: Newable<unknown>);
    test(jpIdentifier: Identifier): boolean;
}
export {};
