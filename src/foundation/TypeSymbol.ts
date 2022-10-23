import { ComponentClass } from './ComponentClass';

export type TypeSymbol<T = unknown> = string | symbol | ComponentClass<T>;
