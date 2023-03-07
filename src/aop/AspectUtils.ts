/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdviceEnum } from './AdviceEnum';

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
    append(advice: AdviceEnum.Before, hook: BeforeHook): void;
    append(advice: AdviceEnum.After, hook: AfterHook): void;
    append(advice: AdviceEnum.TryCatch, hook: ThrownHook): void;
    append(advice: AdviceEnum.TryFinally, hook: FinallyHook): void;
    append(advice: AdviceEnum.AfterReturn, hook: AfterReturnHook): void;
    append(advice: AdviceEnum.Around, hook: AroundHook): void;
    append(advice: AdviceEnum, hook: Function) {
        let hooksArray: Function[] | undefined;
        switch (advice) {
            case AdviceEnum.Before:
                hooksArray = this.beforeHooks;
                break;
            case AdviceEnum.After:
                hooksArray = this.afterHooks;
                break;
            case AdviceEnum.TryCatch:
                hooksArray = this.thrownHooks;
                break;
            case AdviceEnum.TryFinally:
                hooksArray = this.finallyHooks;
                break;
            case AdviceEnum.AfterReturn:
                hooksArray = this.afterReturnHooks;
                break;
            case AdviceEnum.Around:
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
            let returnValue: any;
            try {
                returnValue = fn.apply(this, args);
            } catch (error) {
                if (thrownHooks.length > 0) {
                    thrownHooks.forEach(hook => hook.call(this, error, args));
                } else {
                    throw error;
                }
            } finally {
                finallyHooks.forEach(hook => hook.call(this, args));
            }
            afterHooks.forEach(hook => {
                hook.call(this, args);
            });
            return afterReturnHooks.reduce((retVal, hook) => {
                return hook.call(this, retVal, args);
            }, returnValue);
        };
    }
}
