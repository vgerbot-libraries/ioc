import { ExpressionType } from '../types/EvaluateOptions';
import { Value } from './Value';

export function Argv(name: string, argv: string[] = process.argv) {
    return Value(name, ExpressionType.ARGV, argv);
}
