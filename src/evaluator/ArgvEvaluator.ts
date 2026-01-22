import type { ApplicationContext } from '../foundation/ApplicationContext';
import type { Evaluator } from '../types/Evaluator';

export class ArgvEvaluator implements Evaluator {
    eval<T, A = string[]>(_context: ApplicationContext, expression: string, args?: A): T | undefined {
        const argv = args || process.argv;

        const minimist = require('minimist');
        const map = minimist(argv);
        return map[expression];
    }
}
