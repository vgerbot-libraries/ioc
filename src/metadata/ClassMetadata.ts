// eslint-disable @typescript-eslint/no-explicit-any
import { InstanceScope } from '../foundation/InstanceScope';
import { JsServiceClass } from '../types/JsServiceClass';
import { Metadata, MetadataReader } from '../types/Metadata';
import { Identifier } from '../types/Identifier';
import { Lifecycle } from '../foundation/Lifecycle';
import { Newable } from '../types/Newable';
import { createDefaultValueMap } from '../common/DefaultValueMap';
import { MetadataInstanceManager } from './MetadataInstanceManager';
import { MemberKey } from '../types/MemberKey';
import { KeyOf } from '../types/KeyOf';

const CLASS_METADATA_KEY = 'ioc:class-metadata';

export interface MarkInfo {
    [key: string | symbol]: unknown;
}

export class MarkInfoContainer {
    private readonly map = createDefaultValueMap<MemberKey, MarkInfo>(() => ({} as MarkInfo));
    getMarkInfo(method: MemberKey): MarkInfo {
        return this.map.get(method);
    }
    mark(method: MemberKey, key: MemberKey, value: unknown) {
        const markInfo = this.map.get(method);
        markInfo[key] = value;
    }
    getMembers() {
        return new Set(this.map.keys());
    }
}

export class ParameterMarkInfoContainer {
    private readonly map = createDefaultValueMap<MemberKey, Record<number, MarkInfo>>(() => {
        return {};
    });
    getMarkInfo(method: MemberKey): Record<number, MarkInfo> {
        return this.map.get(method);
    }
    mark(method: MemberKey, index: number, key: MemberKey, value: unknown) {
        const paramsMarkInfo = this.map.get(method);
        const markInfo = paramsMarkInfo[index] || {};
        markInfo[key] = value;
        paramsMarkInfo[index] = markInfo;
    }
}

export interface ClassMarkInfo {
    ctor: MarkInfo;
    members: MarkInfoContainer;
    params: ParameterMarkInfoContainer;
}

export interface ClassMetadataReader<T> extends MetadataReader {
    getClass(): Newable<T>;
    getScope(): InstanceScope | string;
    getConstructorParameterTypes(): Array<Identifier>;
    getMethods(lifecycle: Lifecycle): Array<string | symbol>;
    getPropertyTypeMap(): Map<string | symbol, Identifier>;
    getCtorMarkInfo(): MarkInfo;
    getAllMarkedMembers(): Set<MemberKey>;
    getMembersMarkInfo(methodKey: KeyOf<T>): MarkInfo;
    getParameterMarkInfo(methodKey: KeyOf<T>): Record<number, MarkInfo>;
}

export class ClassMetadata<T> implements Metadata<ClassMetadataReader<T>, Newable<T>> {
    static getReflectKey() {
        return CLASS_METADATA_KEY;
    }
    private scope: InstanceScope | string = InstanceScope.SINGLETON;
    private constructorParameterTypes: Array<Identifier> = [];
    private readonly lifecycleMethodsMap: Record<string | symbol, Set<Lifecycle>> = {};
    private readonly propertyTypesMap = new Map<string | symbol, Identifier>();
    private clazz!: Newable<T>;
    private readonly marks: ClassMarkInfo = {
        ctor: {},
        members: new MarkInfoContainer(),
        params: new ParameterMarkInfoContainer()
    };

    static getInstance<T>(ctor: Newable<T>) {
        return MetadataInstanceManager.getMetadata(ctor, ClassMetadata);
    }
    static getReader<T>(ctor: Newable<T>) {
        return this.getInstance(ctor).reader();
    }

    init(target: Newable<T>) {
        this.clazz = target;
        const constr = target as JsServiceClass<unknown>;
        if (typeof constr.scope === 'function') {
            this.setScope(constr.scope());
        }
        if (typeof constr.inject === 'function') {
            const injections = constr.inject();
            Reflect.ownKeys(injections).forEach(key => {
                this.recordPropertyType(key, injections[key]);
            });
        }
        if (typeof constr.metadata === 'function') {
            const metadata = constr.metadata();
            if (metadata.scope) {
                this.setScope(metadata.scope);
            }
            const injections = metadata.inject;
            if (injections) {
                Reflect.ownKeys(injections).forEach(key => {
                    this.recordPropertyType(key, injections[key]);
                });
            }
        }
    }

    marker() {
        return {
            ctor: (key: string | symbol, value: unknown) => {
                this.marks.ctor[key] = value;
            },
            member: (propertyKey: string | symbol | number) => {
                return {
                    mark: (key: string | symbol, value: unknown) => {
                        this.marks.members.mark(propertyKey, key, value);
                    }
                };
            },
            parameter: (propertyKey: string | symbol, index: number) => {
                return {
                    mark: (key: string | symbol, value: unknown) => {
                        this.marks.params.mark(propertyKey, index, key, value);
                    }
                };
            }
        };
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
    private getSuperClass() {
        const superClassPrototype = Object.getPrototypeOf(this.clazz);
        if (!superClassPrototype) {
            return null;
        }
        const superClass = superClassPrototype.constructor as Newable<unknown>;
        if (superClass === this.clazz) {
            return null;
        }
        return superClass;
    }
    private getSuperClassMetadata(): ClassMetadata<unknown> | null {
        const superClass = this.getSuperClass();
        if (!superClass) {
            return null;
        }
        return ClassMetadata.getInstance(superClass);
    }
    reader(): ClassMetadataReader<T> {
        const superReader = this.getSuperClassMetadata()?.reader();
        return {
            getClass: () => this.clazz,
            getScope: () => {
                return this.scope;
            },
            getConstructorParameterTypes: () => {
                return this.constructorParameterTypes.slice(0);
            },
            getMethods: (lifecycle: Lifecycle) => {
                const superMethods = superReader?.getMethods(lifecycle) || [];
                const thisMethods = this.getMethods(lifecycle);
                return Array.from(new Set(superMethods.concat(thisMethods)));
            },
            getPropertyTypeMap: () => {
                const superPropertyTypeMap = superReader?.getPropertyTypeMap();
                const thisPropertyTypesMap = this.propertyTypesMap;
                if (!superPropertyTypeMap) {
                    return new Map(thisPropertyTypesMap);
                }
                const result = new Map(superPropertyTypeMap);
                thisPropertyTypesMap.forEach((value, key) => {
                    result.set(key, value);
                });
                return result;
            },
            getCtorMarkInfo: (): MarkInfo => {
                return { ...this.marks.ctor };
            },
            getAllMarkedMembers: () => {
                const superMethods = superReader?.getAllMarkedMembers();
                const thisMembers = this.marks.members.getMembers();
                const result = superMethods ? new Set(superMethods) : new Set<MemberKey>();
                thisMembers.forEach(it => result.add(it));
                return result;
            },
            getMembersMarkInfo: (key: KeyOf<T>): MarkInfo => {
                return this.marks.members.getMarkInfo(key as MemberKey);
            },
            getParameterMarkInfo: (methodKey: KeyOf<T>): Record<number, MarkInfo> => {
                return this.marks.params.getMarkInfo(methodKey as MemberKey);
            }
        };
    }
}
