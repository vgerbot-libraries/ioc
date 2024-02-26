import { Newable } from '../types/Newable';
import { getAllMethodMemberNames } from '../common/getAllMethodMemberNames';
import { Identifier } from '../types/Identifier';
import { ClassMetadata } from '../metadata';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';

type MemberIdentifier = string | symbol;

export abstract class Pointcut {
    static combine(...pointcuts: Pointcut[]) {
        return new OrPointcut(pointcuts);
    }
    static of<T>(cls: Newable<T>, ...methodNames: MemberIdentifier[]) {
        const entries = new Map<Newable<unknown>, Set<MemberIdentifier>>();
        const methods = new Set<MemberIdentifier>(methodNames as MemberIdentifier[]);
        if (arguments.length === 1) {
            getAllMethodMemberNames(cls).forEach(methodName => {
                methods.add(methodName);
            });
        }
        entries.set(cls, methods);
        return new PrecitePointcut(entries);
    }
    /**
     * @deprecated
     */
    static testMatch<T>(cls: Newable<T>, regex: RegExp) {
        return this.match(cls, regex);
    }
    static match<T>(cls: Newable<T>, regex: RegExp) {
        return new MemberMatchPointcut(cls, regex);
    }
    static from(...classes: Array<Newable<unknown>>) {
        const of = (...methodNames: MemberIdentifier[]) => {
            return new OrPointcut(classes.map(cls => Pointcut.of(cls, ...methodNames)));
        };
        const match = (regex: RegExp) => {
            return new OrPointcut(
                classes.map(cls => {
                    return new MemberMatchPointcut(cls, regex);
                })
            );
        };
        return {
            of,
            match,
            /**
             * @deprecated
             */
            testMatch: match
        };
    }
    static marked(type: string | symbol, value: unknown = true) {
        return new MarkedPointcut(type, value);
    }
    static class<T>(cls: Newable<T>) {
        return new ClassPointcut(cls);
    }
    abstract test(jpIdentifier: Identifier, jpMember: string | symbol): boolean;
}

class OrPointcut extends Pointcut {
    constructor(private pointcuts: Pointcut[]) {
        super();
    }
    test(jpIdentifier: Identifier, jpMember: string | symbol): boolean {
        return this.pointcuts.some(it => it.test(jpIdentifier, jpMember));
    }
}

class PrecitePointcut extends Pointcut {
    constructor(private readonly methodEntries: Map<Identifier, Set<MemberIdentifier>>) {
        super();
    }
    test(jpIdentifier: Identifier, jpMember: string | symbol): boolean {
        const members = this.methodEntries.get(jpIdentifier);
        return !!members && members.has(jpMember);
    }
}
class MarkedPointcut extends Pointcut {
    constructor(private markedType: string | symbol, private markedValue: unknown = true) {
        super();
    }
    test(jpIdentifier: Identifier, jpMember: string | symbol): boolean {
        if (typeof jpIdentifier !== 'function') {
            return false;
        }
        const metadata = MetadataInstanceManager.getMetadata(jpIdentifier, ClassMetadata);
        const markInfo = metadata.reader().getMembersMarkInfo(jpMember);
        return markInfo[this.markedType] === this.markedValue;
    }
}
class MemberMatchPointcut extends Pointcut {
    constructor(private clazz: Newable<unknown>, private regex: RegExp) {
        super();
    }
    test(jpIdentifier: Identifier, jpMember: string | symbol): boolean {
        return jpIdentifier === this.clazz && typeof jpMember === 'string' && !!this.regex.test(jpMember);
    }
}
class ClassPointcut extends Pointcut {
    constructor(private clazz: Newable<unknown>) {
        super();
    }
    test(jpIdentifier: Identifier): boolean {
        return jpIdentifier === this.clazz;
    }
}
