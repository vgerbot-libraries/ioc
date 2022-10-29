import 'reflect-metadata';
import { Metadata } from './Metadata';
import { Identifier } from '../foundation/Identifier';
import { InstanceScope } from '../foundation/InstanceScope';

export const FUNCTION_METADATA_KEY = Symbol('ioc:function-metadata');

export interface FunctionMetadataReader {
    getParameters(): Identifier[];
    isFactory(): boolean;
    getScope(): InstanceScope | undefined;
}

export class FunctionMetadata implements Metadata<FunctionMetadataReader> {
    static getReflectKey() {
        return FUNCTION_METADATA_KEY;
    }
    private readonly parameters: Identifier[] = [];
    private scope?: InstanceScope;
    private isFactory: boolean = false;
    setParameterType(index: number, symbol: Identifier) {
        this.parameters[index] = symbol;
    }
    setScope(scope: InstanceScope) {
        this.scope = scope;
    }
    setIsFactory(isFactory: boolean) {
        this.isFactory = isFactory;
    }
    init() {
        // PASS;
    }
    reader() {
        return {
            getParameters: () => {
                return this.parameters.slice(0);
            },
            isFactory: () => this.isFactory,
            getScope: () => this.scope
        };
    }
}
