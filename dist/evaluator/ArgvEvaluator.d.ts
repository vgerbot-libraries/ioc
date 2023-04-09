import { Evaluator } from '../types/Evaluator';
import { ApplicationContext } from '../foundation/ApplicationContext';
export declare class ArgvEvaluator implements Evaluator {
    eval<T, A = string[]>(context: ApplicationContext, expression: string, args?: A): T | undefined;
}
