import { ComponentClass } from './ComponentClass';
import { InstanceScope } from './InstanceScope';
import { InstanceGenerationGuard } from './InstanceGenerationGuard';
import { Constructor } from './Constructor';
import { DEFAULT_CONTAINER_ID } from './consts';

const CONTAINERS_LIST: ComponentContainer[] = [];

export class ComponentContainer {
    private guards = new Map<InstanceScope | string, InstanceGenerationGuard>();
    static getContainer(id: string = DEFAULT_CONTAINER_ID) {
        const container = getContainerById(id);
        if (container) {
            return container;
        }
        return new ComponentContainer(id);
    }
    private constructor(public readonly id: string) {
        if (getContainerById(id)) {
            throw new TypeError(`Duplicate container id: ${id}!`);
        }
        CONTAINERS_LIST.push(this);
    }

    getComponentInstance<T, O>(theClass: ComponentClass<T>, owner?: O): T {
        return null as unknown as T;
    }
    destroy() {
        const index = CONTAINERS_LIST.findIndex(it => it.id === this.id);
        if (index > -1) {
            CONTAINERS_LIST.splice(index, 1);
        }
    }
    registerGuard(
        scope: InstanceScope | string,
        guardConstructor: Constructor<InstanceGenerationGuard>,
        constructorArgs: unknown[] = []
    ) {
        this.guards.set(scope, new guardConstructor(...constructorArgs));
    }
    getGuard(scope: InstanceScope | string) {
        return this.guards.get(scope);
    }
}

function getContainerById(id: string) {
    return CONTAINERS_LIST.find(it => it.id === id);
}
