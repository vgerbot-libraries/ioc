import { Evaluator } from '../types/Evaluator';
import { ApplicationContext } from '../foundation/ApplicationContext';
import { JSONData } from '../types/JSONData';
export declare class JSONDataEvaluator implements Evaluator {
    private readonly namespaceDataMap;
    eval<T>(context: ApplicationContext, expression: string): T | undefined;
    recordData(namespace: string, data: JSONData): void;
    getJSONData(namespace: string): JSONData | undefined;
}
