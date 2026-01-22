import type { Newable } from '../types/Newable';
import type { Advice } from './Advice';
import type { Pointcut } from './Pointcut';

export interface AspectInfo<T> {
    aspectClass: Newable<T>;
    methodName: string | symbol;
    advice: Advice;
    pointcut: Pointcut;
}
