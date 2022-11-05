import { Evaluator } from '../types/Evaluator';
import { ApplicationContext } from './ApplicationContext';
import { JSONData } from '../types/JSONData';

export class JSONDataEvaluator implements Evaluator {
    private readonly namespaceDataMap = new Map<string, JSONData>();
    eval<T>(context: ApplicationContext, expression: string): T | undefined {
        const colonIndex = expression.indexOf(':');
        if (colonIndex === -1) {
            throw new Error('Incorrect expression, namespace not specified');
        }
        const namespace = expression.substring(0, colonIndex);
        const exp = expression.substring(colonIndex + 1);
        if (!this.namespaceDataMap.has(namespace)) {
            throw new Error(`Incorrect expression: namespace not recorded: "${namespace}"`);
        }
        const data = this.namespaceDataMap.get(namespace) as JSONData;
        return runExpression(exp, data as Object);
    }
    recordData(namespace: string, data: JSONData) {
        this.namespaceDataMap.set(namespace, data);
    }
}

function runExpression(expression: string, rootContext: Object) {
    const fn = compileExpression(expression);
    return fn(rootContext);
}

function compileExpression(expression: string) {
    if (expression.indexOf(',') > -1) {
        throw new Error(`Incorrect expression syntax, The ',' is not allowed in expression: "${expression}"`);
    }
    if (expression.length > 120) {
        throw new Error(
            `Incorrect expression syntax, expression length cannot be greater than 120, but actual: ${expression.length}`
        );
    }
    if (/\(.*?\)/.test(expression)) {
        throw new Error(`Incorrect expression syntax, parentheses are not allowed in expression: "${expression}"`);
    }
    expression = expression.trim();
    if (expression === '') {
        return (root: Object) => root;
    }

    const rootVarName = varName('context');
    return new Function(
        rootVarName,
        `
        "use strict";
        try {
            return ${rootVarName}.${expression};
        } catch(error) { throw error }
    `
    );
}
let VAR_SEQUENCE = Date.now();
function varName(prefix: string) {
    return prefix + '' + (VAR_SEQUENCE++).toString(16);
}
