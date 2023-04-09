import { Pointcut } from './Pointcut';
import { Newable } from '../types/Newable';
import { Advice } from './Advice';
export declare function addAspect(componentAspectClass: Newable<unknown>, methodName: string | symbol, advice: Advice, pointcut: Pointcut): void;
