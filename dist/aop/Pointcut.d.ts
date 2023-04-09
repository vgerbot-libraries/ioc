import { Newable } from '../types/Newable';
type MemberIdentifier = string | symbol;
export declare class Pointcut {
    private readonly methodEntries;
    static combine(...ps: Pointcut[]): Pointcut;
    static of<T>(cls: Newable<T>, ...methodNames: MemberIdentifier[]): Pointcut;
    static testMatch<T>(cls: Newable<T>, regex: RegExp): Pointcut;
    static from(...classes: Array<Newable<unknown>>): {
        of: (...methodNames: MemberIdentifier[]) => Pointcut;
        testMatch: (regex: RegExp) => Pointcut;
    };
    constructor(methodEntries: Map<Newable<unknown>, Set<MemberIdentifier>>);
    combine(other: Pointcut): Pointcut;
    getMethodsMap(): Map<Newable<unknown>, Set<MemberIdentifier>>;
}
export {};
