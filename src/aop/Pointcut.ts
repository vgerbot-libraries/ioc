import { Newable } from '../types/Newable';
import { getAllMethodMemberNames } from '../common/getAllMethodMemberNames';

type MemberIdentifier = string | symbol;

export class Pointcut {
    static combine(...ps: Pointcut[]) {
        return ps.reduce((prev, it) => {
            return prev.combine(it);
        });
    }
    static of<T>(cls: Newable<T>, ...methodNames: MemberIdentifier[]) {
        const entries = new Map<Newable<unknown>, Set<MemberIdentifier>>();
        const methods = new Set<MemberIdentifier>(methodNames as MemberIdentifier[]);
        entries.set(cls, methods);
        return new Pointcut(entries);
    }
    static testMatch<T>(cls: Newable<T>, regex: RegExp) {
        const methodNames = getAllMethodMemberNames(cls);
        const matchMethodNames = Array.from(methodNames).filter(it => {
            return regex.test(it);
        });
        return Pointcut.of(cls, ...matchMethodNames);
    }
    static from(...classes: Array<Newable<unknown>>) {
        const of = (...methodNames: MemberIdentifier[]) => {
            return Pointcut.combine(...classes.map(cls => Pointcut.of(cls, ...methodNames)));
        };
        const testMatch = (regex: RegExp) => {
            return Pointcut.combine(
                ...classes.map(cls => {
                    return Pointcut.testMatch(cls, regex);
                })
            );
        };
        return {
            of,
            testMatch
        };
    }
    constructor(private readonly methodEntries: Map<Newable<unknown>, Set<MemberIdentifier>>) {}
    combine(other: Pointcut) {
        const map = new Map<Newable<unknown>, Set<MemberIdentifier>>(this.methodEntries);
        const otherMap = other.methodEntries;
        otherMap.forEach((value, key) => {
            const set = map.get(key);
            if (!!set) {
                value.forEach(item => {
                    set.add(item);
                });
            } else {
                map.set(key, value);
            }
        });
        return new Pointcut(map);
    }
    getMethodsMap() {
        return new Map(this.methodEntries);
    }
}
