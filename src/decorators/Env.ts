import { ExpressionType } from '../types/EvaluateOptions';
import { Value } from './Value';

export function Env(name: string) {
    return Value(name, ExpressionType.ENV);
}
