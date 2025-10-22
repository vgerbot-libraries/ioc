import { ServiceFactory } from '../types/ServiceFactory';
import { Identifier } from '../types/Identifier';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { ApplicationContext } from './ApplicationContext';
import { InstanceScope } from './InstanceScope';

export class ServiceFactoryDef<T> {
    static createFromClassMetadata<T>(metadata: ClassMetadata<T>) {
        const def = new ServiceFactoryDef(metadata.reader().getClass(), InstanceScope.SINGLETON);
        def.append((container: ApplicationContext, owner: unknown) => {
            return () => {
                const reader = metadata.reader();
                const clazz = reader.getClass();
                return container.getInstance(clazz, owner);
            };
        });
        return def;
    }
    public readonly factories = new Map<ServiceFactory<T, unknown>, Identifier[]>();
    /**
     * @param identifier The unique identifier of this factories
     * @param isSingle Indicates whether the identifier defines only one factory.
     */
    constructor(public readonly identifier: Identifier, public readonly scope: InstanceScope | string) {}
    append(factory: ServiceFactory<T, unknown>, injections: Identifier[] = []) {
        if (this.scope === InstanceScope.SINGLETON && this.factories.size === 1 && this.factories.has(factory)) {
            throw new Error(`${this.identifier.toString()} is A singleton! But multiple factories are defined!`);
        }
        this.factories.set(factory, injections);
    }
    produce(container: ApplicationContext, owner?: unknown) {
        // if (this.isSingle) {
        //     const [factory, injections] = this.factories.entries().next().value as [ServiceFactory<T, unknown>, Identifier[]];
        //     const fn = factory(container, owner);
        //     return () => {
        //         return container.invoke(fn, {
        //             injections
        //         });
        //     };
        // } else {
        // }
        const producers = Array.from(this.factories).map(([factory, injections]) => {
            const fn = factory(container, owner);
            return () => {
                return container.invoke(fn, {
                    injections
                });
            };
        });
        return () => {
            return producers.map(it => it());
        };
    }
}
