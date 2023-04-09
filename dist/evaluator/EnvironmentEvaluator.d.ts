import { Evaluator } from '../types/Evaluator';
import { ApplicationContext } from '../foundation/ApplicationContext';
export declare class EnvironmentEvaluator implements Evaluator {
    eval<T>(context: ApplicationContext, expression: string): T | undefined;
}
