import { Newable } from '../types/Newable';
import { Advice } from './Advice';
import { Pointcut } from './Pointcut';

export interface AspectInfo<T> {
    aspectClass: Newable<T>;
    methodName: string | symbol;
    advice: Advice;
    pointcut: Pointcut;
}
