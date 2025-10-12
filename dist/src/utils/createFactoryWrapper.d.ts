import { FactoryIdentifier } from '../types/FactoryIdentifier';
export declare function createFactoryWrapper<T>(produceIdentifier: FactoryIdentifier, produce: unknown, owner: T): T;
