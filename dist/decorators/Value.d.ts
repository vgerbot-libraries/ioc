import { ExpressionType } from '../types/EvaluateOptions';
export declare function Value<A = unknown>(expression: string, type: ExpressionType | string, externalArgs?: A): PropertyDecorator;
