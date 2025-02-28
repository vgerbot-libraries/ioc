import { ApplicationContext } from '../foundation/ApplicationContext';
export interface Evaluator {
    eval<T, A = unknown>(context: ApplicationContext, expression: string, args?: A): T | undefined;
}
