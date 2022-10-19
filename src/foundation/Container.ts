import { ComponentClass } from './ComponentClass';
import { InstanceScope } from '../guards/InstanceScope';
import { InstanceGenerationGuard } from './InstanceGenerationGuard';
import { Constructor } from './Constructor';

export const ROOT_APPLICATION_CONTEXT_NAME = '';

const CONTAINERS_LIST: Container[] = [];

export class Container {
    protected constructor(private readonly name: string, private readonly parent: Container = ROOT_CONTAINER) {
        if (CONTAINERS_LIST.find(it => it.name === name)) {
            throw new TypeError(`Duplicate container name: ${name}!`);
        }
        CONTAINERS_LIST.push(this);
        console.log(parent);
    }

    getInstanceByClass<T>(theClass: ComponentClass<T>): T {
        return null as unknown as T;
    }

    createSubContainer(name: string) {
        const container = new Container(name, this);
        return container;
    }
    registerGuard(
        scope: InstanceScope | string,
        guardConstructor: Constructor<InstanceGenerationGuard>,
        constructorArgs: unknown[] = []
    ) {
        this.getRoot().registerGuard(scope, guardConstructor, constructorArgs);
    }
    getGuard(scope: InstanceScope | string) {
        return this.getRoot().getGuard(scope);
    }
    getRoot() {
        return ROOT_CONTAINER;
    }
    destroy() {
        const index = CONTAINERS_LIST.findIndex(it => it.name === this.name);
        if (index > -1) {
            CONTAINERS_LIST.splice(index, 1);
        }
    }
}

class RootContainer extends Container {
    private guards = new Map<InstanceScope | string, InstanceGenerationGuard>();
    constructor() {
        super(ROOT_APPLICATION_CONTEXT_NAME);
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

export const ROOT_CONTAINER = new RootContainer();
