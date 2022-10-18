import { ComponentClass } from './ComponentClass';

export const ROOT_APPLICATION_CONTEXT_NAME = '';

const CONTAINERS_LIST: Container[] = [];

export class Container {
    static ROOT_CONTAINER = new Container(ROOT_APPLICATION_CONTEXT_NAME);
    protected constructor(private readonly name: string, private readonly parent = Container.ROOT_CONTAINER) {
        if (CONTAINERS_LIST.find(it => it.name === name)) {
            throw new TypeError(`Duplicate application name: ${name}!`);
        }
        CONTAINERS_LIST.push(this);
    }

    getInstanceByClass<T>(theClass: ComponentClass<T>): T {
        return null as unknown as T;
    }

    createSubContainer(name: string) {
        const container = new Container(name, this);
        return container;
    }
    getRoot() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let root: Container = this;
        while (root.parent) {
            root = root.parent;
        }
        return root;
    }
    destroy() {
        const index = CONTAINERS_LIST.findIndex(it => it.name === this.name);
        if (index > -1) {
            CONTAINERS_LIST.splice(index, 1);
        }
    }
}
