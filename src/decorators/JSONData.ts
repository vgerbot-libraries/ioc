import { ExpressionType } from '../types/EvaluateOptions';
import { Value } from './Value';

export function JSONData(namespace: string, jsonpath: string) {
    return Value(`${namespace}:${jsonpath}`, ExpressionType.JSON_PATH);
}
