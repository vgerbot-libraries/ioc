/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdviceEnum } from './AdviceEnum';

export interface Aspect {
    execute(ctx: AspectContext): any;
}
export interface AspectContext {
    target: any;
    methodName: string;
    functionParams: any[];
    returnValue: any;
    error: any;
    advice?: AdviceEnum;
    params?: any;
}
