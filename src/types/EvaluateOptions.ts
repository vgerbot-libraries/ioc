export interface EvaluationOptions<O, E extends string> {
    type: E;
    owner?: O;
    propertyName?: string | symbol;
}

export enum ExpressionType {
    ENV = 'environment',
    JSON_PATH = 'json-path'
}
