import { InstanceScope } from '../foundation/InstanceScope';
import { TaggedConstructor } from '../foundation/TaggedConstructor';
import { Metadata } from './Metadata';
import { TypeSymbol } from '../foundation/TypeSymbol';
import { Lifecycle } from '../foundation/Lifecycle';
import { ComponentClass } from '../foundation/ComponentClass';

const CLASS_METADATA_KEY = 'ioc:class-metadata';

export interface ClassMetadataReader {
    getScope(): InstanceScope;
    getConstructorParameterTypes(): Array<TypeSymbol>;
    getMethods(lifecycle: Lifecycle): Array<string | symbol>;
    getPropertyTypeMap(): Map<string | symbol, TypeSymbol>;
}

export class ClassMetadata implements Metadata<ClassMetadataReader> {
    static getMetadata<T extends ComponentClass>(target: T): ClassMetadata {
        let metadata = ClassMetadata._getMetadata(target);
        if (!metadata) {
            const constr = target as unknown as TaggedConstructor;
            metadata = new ClassMetadata();
            if (typeof constr.scope === 'function') {
                metadata.setScope(constr.scope());
            }
            Reflect.defineMetadata(CLASS_METADATA_KEY, metadata, target);
        }
        return metadata;
    }
    private scope: InstanceScope = InstanceScope.SINGLETON;
    private constructorParameterTypes: Array<TypeSymbol> = [];
    private readonly lifecycleMethodsMap: Record<string | symbol, Set<Lifecycle>> = {};
    private readonly propertyTypesMap = new Map<string | symbol, TypeSymbol>();
    private static _getMetadata<T extends ComponentClass>(target: T): ClassMetadata | undefined {
        return Reflect.getMetadata(CLASS_METADATA_KEY, target);
    }
    private constructor() {
        // PASS
    }
    setScope(scope: InstanceScope) {
        this.scope = scope;
    }
    setConstructorParameterType(index: number, cls: TypeSymbol) {
        this.constructorParameterTypes[index] = cls;
    }
    recordPropertyType(propertyKey: string | symbol, type: TypeSymbol) {
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
