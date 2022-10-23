import { UnknownTypeInstance } from './UnknownInstanceType';

export type ComponentClass<T = UnknownTypeInstance> = new (...args: unknown[]) => T;
