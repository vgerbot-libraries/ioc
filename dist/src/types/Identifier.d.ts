import { Newable } from './Newable';
export type Identifier<T = unknown> = string | symbol | Newable<T>;
