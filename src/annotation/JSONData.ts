import { Value } from './Value';
import { ExpressionType } from '../types/EvaluateOptions';

export function JSONData(namespace: string, jsonpath: string) {
    return Value(`${namespace}:${jsonpath}`, ExpressionType.JSON_PATH);
}
