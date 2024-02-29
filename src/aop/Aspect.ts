/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationContext } from '../foundation';
import { Advice } from './Advice';

export interface Aspect {
    execute(ctx: JoinPoint): any;
}
export interface ProceedingAspect {
    execute(ctx: ProceedingJoinPoint): any;
}
export interface JoinPoint {
    target: any;
    methodName: string | symbol;
    arguments: any[];
    returnValue: any;
    error: any;
    advice: Advice;
    ctx: ApplicationContext;
}

export interface ProceedingJoinPoint extends JoinPoint {
    proceed(args?: any[]): any;
}
