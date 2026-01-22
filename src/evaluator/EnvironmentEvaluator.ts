import type { ApplicationContext } from '../foundation/ApplicationContext';
import type { Evaluator } from '../types/Evaluator';

export class EnvironmentEvaluator implements Evaluator {
    eval<T>(_context: ApplicationContext, expression: string): T | undefined {
        return process.env[expression] as T | undefined;
    }
}
