import { ServiceFactory } from '../types/ServiceFactory';
import { Identifier } from '../types/Identifier';

export class ServiceFactoryDef<T> {
    constructor(public readonly factory: ServiceFactory<T>, public readonly injections?: Identifier[]) {}
}
