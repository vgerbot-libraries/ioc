import 'reflect-metadata';
import { Metadata } from './Metadata';
import { TypeSymbol } from '../foundation/TypeSymbol';

export const FUNCTION_METADATA_KEY = Symbol('ioc:function-metadata');

export interface FunctionMetadataReader {
    getParameters(): TypeSymbol[];
}

export class FunctionMetadata implements Metadata<FunctionMetadataReader> {
    static getMetadata<T extends Function>(target: T): FunctionMetadata {
        let metadata = Reflect.getMetadata(FUNCTION_METADATA_KEY, target);
        if (!metadata) {
            metadata = new FunctionMetadata();
            Reflect.defineMetadata(FUNCTION_METADATA_KEY, metadata, target);
        }
        return metadata;
    }
    private readonly parameters: TypeSymbol[] = [];
    setParameterType(index: number, symbol: TypeSymbol) {
        this.parameters[index] = symbol;
    }
    reader() {
        return {
            getParameters: () => {
                return this.parameters.slice(0);
            }
        };
    }
}
