export interface EvaluationOptions<O, E extends string, A = unknown> {
    type: E;
    owner?: O;
    propertyName?: string | symbol;
    externalArgs?: A;
}

export enum ExpressionType {
    ENV = 'inject-environment-variables',
    JSON_PATH = 'inject-json-data',
    ARGV = 'inject-argv'
}
