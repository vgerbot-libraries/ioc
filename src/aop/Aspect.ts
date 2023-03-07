/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdviceEnum } from './AdviceEnum';

export interface Aspect {
    execute(ctx: JoinPoint): any;
}
export interface JoinPoint {
    target: any;
    methodName: string | symbol;
    functionParams: any[];
    returnValue: any;
    error: any;
    advice: AdviceEnum;
    aspectParams?: any;
}

export interface ProceedingJoinPoint extends JoinPoint {
    proceed(args?: any[]): any;
}
