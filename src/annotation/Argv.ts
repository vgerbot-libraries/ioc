import { Value } from './Value';
import { ExpressionType } from '../types/EvaluateOptions';

export function Argv(name: string, argv: string[] = process.argv) {
    return Value(name, ExpressionType.ARGV, argv);
}
