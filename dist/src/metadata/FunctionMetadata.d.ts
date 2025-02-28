import 'reflect-metadata';
import { Metadata } from '../types/Metadata';
import { Identifier } from '../types/Identifier';
import { InstanceScope } from '../foundation/InstanceScope';
export declare const FUNCTION_METADATA_KEY: unique symbol;
export interface FunctionMetadataReader {
    getParameters(): Identifier[];
    isFactory(): boolean;
    getScope(): InstanceScope | undefined;
}
export declare class FunctionMetadata implements Metadata<FunctionMetadataReader, Function> {
    static getReflectKey(): symbol;
    private readonly parameters;
    private scope?;
    private isFactory;
    setParameterType(index: number, symbol: Identifier): void;
    setScope(scope: InstanceScope): void;
    setIsFactory(isFactory: boolean): void;
    init(): void;
    reader(): {
        getParameters: () => Identifier<unknown>[];
        isFactory: () => boolean;
        getScope: () => InstanceScope | undefined;
    };
}
