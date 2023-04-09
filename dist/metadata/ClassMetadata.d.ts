import { InstanceScope } from '../foundation/InstanceScope';
import { Metadata, MetadataReader } from '../types/Metadata';
import { Identifier } from '../types/Identifier';
import { Lifecycle } from '../foundation/Lifecycle';
import { Newable } from '../types/Newable';
import { MemberKey } from '../types/MemberKey';
export interface MarkInfo {
    [key: string | symbol]: unknown;
}
export declare class MarkInfoContainer {
    private readonly map;
    getMarkInfo(method: MemberKey): MarkInfo;
    mark(method: MemberKey, key: MemberKey, value: unknown): void;
}
export declare class ParameterMarkInfoContainer {
    private readonly map;
    getMarkInfo(method: MemberKey): Record<number, MarkInfo>;
    mark(method: MemberKey, index: number, key: MemberKey, value: unknown): void;
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
export declare class ClassMetadata<T> implements Metadata<ClassMetadataReader<T>, Newable<T>> {
    static getReflectKey(): string;
    private scope;
    private constructorParameterTypes;
    private readonly lifecycleMethodsMap;
    private readonly propertyTypesMap;
    private clazz;
    private readonly marks;
    static getInstance<T>(ctor: Newable<T>): ClassMetadata<any>;
    init(target: Newable<T>): void;
    marker(): {
        ctor: (key: string | symbol, value: unknown) => void;
        member: (propertyKey: string | symbol | number) => {
            mark: (key: string | symbol, value: unknown) => void;
        };
        parameter: (propertyKey: string | symbol, index: number) => {
            mark: (key: string | symbol, value: unknown) => void;
        };
    };
    setScope(scope: InstanceScope | string): void;
    setConstructorParameterType(index: number, cls: Identifier): void;
    recordPropertyType(propertyKey: string | symbol, type: Identifier): void;
    addLifecycleMethod(methodName: string | symbol, lifecycle: Lifecycle): void;
    private getLifecycles;
    getMethods(lifecycle: Lifecycle): Array<string | symbol>;
    reader(): ClassMetadataReader<T>;
}
