/* eslint-disable @typescript-eslint/no-explicit-any */
import { Advice } from './Advice';

export interface Aspect {
    execute(ctx: JoinPoint): any;
}
export interface JoinPoint {
    target: any;
    methodName: string | symbol;
    functionParams: any[];
    returnValue: any;
    error: any;
    advice: Advice;
    aspectParams?: any;
}

export interface ProceedingJoinPoint extends JoinPoint {
    proceed(args?: any[]): any;
}
