import { Advice } from './Advice';
type BeforeHook = (args: any[]) => void;
type AfterHook = (args: any[]) => void;
type ThrownHook = (reason: any, args: any[]) => void;
type FinallyHook = (args: any[]) => void;
type AfterReturnHook = (returnValue: any, args: any[]) => any;
type AroundHook = (this: any, originfn: (...args: any[]) => void, args: any[]) => void;
export declare class AspectUtils {
    private fn;
    private beforeHooks;
    private afterHooks;
    private thrownHooks;
    private finallyHooks;
    private afterReturnHooks;
    private aroundHooks;
    constructor(fn: (...args: any[]) => any);
    append(advice: Advice.Before, hook: BeforeHook): void;
    append(advice: Advice.After, hook: AfterHook): void;
    append(advice: Advice.Thrown, hook: ThrownHook): void;
    append(advice: Advice.Finally, hook: FinallyHook): void;
    append(advice: Advice.AfterReturn, hook: AfterReturnHook): void;
    append(advice: Advice.Around, hook: AroundHook): void;
    extract(): (this: any, ...args: any[]) => any;
}
export {};
