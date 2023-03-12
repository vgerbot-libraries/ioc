/* eslint-disable @typescript-eslint/no-explicit-any */
import { Advice } from './Advice';

type BeforeHook = (args: any[]) => void;
type AfterHook = (args: any[]) => void;
type ThrownHook = (reason: any, args: any[]) => void;
type FinallyHook = (args: any[]) => void;
type AfterReturnHook = (returnValue: any, args: any[]) => any;
type AroundHook = (this: any, originfn: (...args: any[]) => void, args: any[]) => void;

export class AspectUtils {
    private beforeHooks: Array<BeforeHook> = [];
    private afterHooks: Array<AfterHook> = [];
    private thrownHooks: Array<ThrownHook> = [];
    private finallyHooks: Array<FinallyHook> = [];
    private afterReturnHooks: Array<AfterReturnHook> = [];
    private aroundHooks: Array<AroundHook> = [];
    constructor(private fn: (...args: any[]) => any) {}
    append(advice: Advice.Before, hook: BeforeHook): void;
    append(advice: Advice.After, hook: AfterHook): void;
    append(advice: Advice.Thrown, hook: ThrownHook): void;
    append(advice: Advice.Finally, hook: FinallyHook): void;
    append(advice: Advice.AfterReturn, hook: AfterReturnHook): void;
    append(advice: Advice.Around, hook: AroundHook): void;
    append(advice: Advice, hook: Function) {
        let hooksArray: Function[] | undefined;
        switch (advice) {
            case Advice.Before:
                hooksArray = this.beforeHooks;
                break;
            case Advice.After:
                hooksArray = this.afterHooks;
                break;
            case Advice.Thrown:
                hooksArray = this.thrownHooks;
                break;
            case Advice.Finally:
                hooksArray = this.finallyHooks;
                break;
            case Advice.AfterReturn:
                hooksArray = this.afterReturnHooks;
                break;
            case Advice.Around:
                hooksArray = this.aroundHooks;
                break;
        }
        if (hooksArray) {
            hooksArray.push(hook);
        }
    }
    extract() {
        const { aroundHooks, beforeHooks, afterHooks, afterReturnHooks, finallyHooks, thrownHooks } = this;
        const fn = aroundHooks.reduceRight((prev, next) => {
            return function (...args) {
                return next.call(this, prev, args);
            };
        }, this.fn) as typeof this.fn;
        return function (this: any, ...args: any[]) {
            beforeHooks.forEach(hook => {
                hook.call(this, args);
            });
            const invoke = (onError: (reason: any) => void, onFinally: () => void, onAfter: (returnValue: any) => any) => {
                let returnValue: any;
                let isPromise = false;
                try {
                    returnValue = fn.apply(this, args);
                    if (returnValue instanceof Promise) {
                        isPromise = true;
                        returnValue = returnValue.catch(onError).finally(onFinally);
                    }
                } catch (error) {
                    onError(error);
                } finally {
                    if (!isPromise) {
                        onFinally();
                    }
                }
                if (isPromise) {
                    return returnValue.then((value: any) => {
                        return onAfter(value);
                    });
                } else {
                    return onAfter(returnValue);
                }
            };
            return invoke(
                error => {
                    if (thrownHooks.length > 0) {
                        thrownHooks.forEach(hook => hook.call(this, error, args));
                    } else {
                        throw error;
                    }
                },
                () => {
                    finallyHooks.forEach(hook => hook.call(this, args));
                },
                value => {
                    afterHooks.forEach(hook => {
                        hook.call(this, args);
                    });
                    return afterReturnHooks.reduce((retVal, hook) => {
                        return hook.call(this, retVal, args);
                    }, value);
                }
            );
        };
    }
}
