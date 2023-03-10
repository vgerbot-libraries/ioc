import { Value } from './Value';
import { ExpressionType } from '../types/EvaluateOptions';

export function Env(name: string) {
    return Value(name, ExpressionType.ENV);
}
