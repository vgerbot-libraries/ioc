import { Evaluator } from '../types/Evaluator';
import { ApplicationContext } from '../foundation/ApplicationContext';

export class ArgvEvaluator implements Evaluator {
    eval<T, A = string[]>(context: ApplicationContext, expression: string, args?: A): T | undefined {
        const argv = args || process.argv;
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const minimist = require('minimist');
        const map = minimist(argv);
        console.log(args, map);
        return map[expression];
    }
}
