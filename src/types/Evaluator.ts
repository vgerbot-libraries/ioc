import { ApplicationContext } from '../foundation/ApplicationContext';

export interface Evaluator {
    eval<T>(context: ApplicationContext, expression: string): T | undefined;
}
