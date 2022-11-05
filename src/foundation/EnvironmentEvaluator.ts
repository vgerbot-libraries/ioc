import { Evaluator } from '../types/Evaluator';
import { ApplicationContext } from './ApplicationContext';

export class EnvironmentEvaluator implements Evaluator {
    eval<T>(context: ApplicationContext, expression: string): T | undefined {
        return process.env[expression] as T | undefined;
    }
}
