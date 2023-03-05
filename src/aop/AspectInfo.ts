import { Newable } from '../types/Newable';
import { AdviceEnum } from './AdviceEnum';
import { Pointcut } from './Pointcut';

export interface AspectInfo<T> {
    aspectClass: Newable<T>;
    methodName: string | symbol;
    advice: AdviceEnum;
    pointcut: Pointcut;
}
