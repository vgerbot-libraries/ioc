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
    getMembersMarkInfo(methodKey: keyof T): MarkInfo;
    getParameterMarkInfo(methodKey: keyof T): Record<number, MarkInfo>;
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

    init(target: Newable<T>) {
        this.clazz = target;
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
        if (typeof constr.metadata === 'function') {
            const metadata = constr.metadata();
            if (metadata.scope) {
                this.setScope(metadata.scope);
            }
            const injections = metadata.inject;
            if (injections) {
                for (const key in injections) {
                    this.recordPropertyType(key, injections[key]);
                }
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
    reader(): ClassMetadataReader<T> {
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
            getPropertyTypeMap: () => new Map(this.propertyTypesMap),
            getCtorMarkInfo: (): MarkInfo => {
                return { ...this.marks.ctor };
            },
            getMembersMarkInfo: (key: keyof T): MarkInfo => {
                return this.marks.members.getMarkInfo(key);
            },
            getParameterMarkInfo: (methodKey: keyof T): Record<number, MarkInfo> => {
                return this.marks.params.getMarkInfo(methodKey);
            }
        };
    }
}
