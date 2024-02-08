import { ServiceFactoryDef } from '../foundation/ServiceFactoryDef';
import { FactoryIdentifier } from '../types/FactoryIdentifier';
import { Identifier } from '../types/Identifier';
import { ServiceFactory } from '../types/ServiceFactory';

export class FactoryRecorder {
    private factories = new Map<FactoryIdentifier, ServiceFactoryDef<unknown>>();

    public append<T>(
        identifier: FactoryIdentifier,
        factory: ServiceFactory<T, unknown>,
        injections: Identifier[] = [],
        isSingle: boolean = true
    ) {
        let def = this.factories.get(identifier);
        if (def) {
            def.append(factory, injections);
        } else {
            def = new ServiceFactoryDef(identifier, isSingle);
            def.append(factory, injections);
        }
        this.factories.set(identifier, def);
    }
    public set(identifier: FactoryIdentifier, factoryDef: ServiceFactoryDef<unknown>) {
        this.factories.set(identifier, factoryDef);
    }
    public get<T>(identifier: FactoryIdentifier): ServiceFactoryDef<T> | undefined {
        return this.factories.get(identifier) as ServiceFactoryDef<T> | undefined;
    }
    public iterator() {
        return this.factories.entries();
    }
}
