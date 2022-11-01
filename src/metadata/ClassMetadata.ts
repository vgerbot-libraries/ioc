import { InstanceScope } from '../foundation/InstanceScope';
import { JsServiceClass } from '../types/JsServiceClass';
import { Metadata } from '../types/Metadata';
import { Identifier } from '../types/Identifier';
import { Lifecycle } from '../foundation/Lifecycle';
import { Newable } from '../types/Newable';

const CLASS_METADATA_KEY = 'ioc:class-metadata';

export interface ClassMetadataReader {
    getClass(): Newable<any>;
    getScope(): InstanceScope | string;
    getConstructorParameterTypes(): Array<Identifier>;
    getMethods(lifecycle: Lifecycle): Array<string | symbol>;
    getPropertyTypeMap(): Map<string | symbol, Identifier>;
}

export class ClassMetadata implements Metadata<ClassMetadataReader> {
    static getReflectKey() {
        return CLASS_METADATA_KEY;
    }
    private scope: InstanceScope | string = InstanceScope.SINGLETON;
    private constructorParameterTypes: Array<Identifier> = [];
    private readonly lifecycleMethodsMap: Record<string | symbol, Set<Lifecycle>> = {};
    private readonly propertyTypesMap = new Map<string | symbol, Identifier>();
    private clazz!: Newable<any>;

    init<T>(target: T) {
        this.clazz = target as Newable<any>;
        const constr = target as JsServiceClass<unknown>;
        if (typeof constr.scope === 'function') {
            this.setScope(constr.scope());
        }
        if (typeof constr.inject === 'function') {
            const injections = constr.inject();
            for (const key in injections) {
                this.recordPropertyType(key, injections[key]);
            }
        }
    }
    setScope(scope: InstanceScope | string) {
        this.scope = scope;
    }
    setConstructorParameterType(index: number, cls: Identifier) {
        this.constructorParameterTypes[index] = cls;
    }
    recordPropertyType(propertyKey: string | symbol, type: Identifier) {
        this.propertyTypesMap.set(propertyKey, type);
    }
    addLifecycleMethod(methodName: string | symbol, lifecycle: Lifecycle) {
        const lifecycles = this.getLifecycles(methodName);
        lifecycles.add(lifecycle);
        this.lifecycleMethodsMap[methodName] = lifecycles;
    }
    private getLifecycles(methodName: string | symbol) {
        return this.lifecycleMethodsMap[methodName] || new Set<Lifecycle>();
    }
    getMethods(lifecycle: Lifecycle): Array<string | symbol> {
        return Object.keys(this.lifecycleMethodsMap).filter(it => {
            const lifecycles = this.lifecycleMethodsMap[it];
            return lifecycles.has(lifecycle);
        });
    }
    reader() {
        return {
            getClass: () => this.clazz,
            getScope: () => {
                return this.scope;
            },
            getConstructorParameterTypes: () => {
                return this.constructorParameterTypes.slice(0);
            },
            getMethods: (lifecycle: Lifecycle) => {
                return this.getMethods(lifecycle);
            },
            getPropertyTypeMap: () => new Map(this.propertyTypesMap)
        };
    }
}
