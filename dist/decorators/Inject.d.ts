import { Identifier } from '../types/Identifier';
export declare function Inject<T>(constr: Identifier<T>): <Target>(target: Target, propertyKey: string | symbol, parameterIndex?: number) => void;
