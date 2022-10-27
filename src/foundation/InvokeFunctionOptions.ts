import { TypeSymbol } from './TypeSymbol';

export interface InvokeFunctionOptions<T> {
    context?: T;
    parameters?: TypeSymbol[];
}
