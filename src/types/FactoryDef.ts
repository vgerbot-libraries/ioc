import { ServiceFactory } from '../foundation/ServiceFactory';
import { Identifier } from '../foundation/Identifier';

export class FactoryDef<T> {
    constructor(public readonly factory: ServiceFactory<T>, public readonly injections?: Identifier[]) {}
}
