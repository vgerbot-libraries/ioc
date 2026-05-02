declare enum Advice {
    Before = 0,
    After = 1,
    Around = 2,
    AfterReturn = 3,
    Thrown = 4,
    Finally = 5
}

type DefaultValueMap<K, V> = Omit<Map<K, V>, 'get'> & {
    get: (key: K) => V;
};

type Newable<T> = Function & {
    new (...args: any[]): T;
};

interface Metadata<R extends MetadataReader, Target> {
    init(target: Target): void;
    reader(): R;
}
type MetadataReader = {};

type Identifier<T = unknown> = string | symbol | Newable<T>;

declare class InjectionType {
    readonly clazz: Newable<unknown>;
    readonly identifier: Identifier;
    static ofClazz(clazz: Newable<unknown>): InjectionType;
    static ofIdentifier(identifier: Identifier): InjectionType;
    static of(clazz: Newable<unknown>, identifier?: Identifier): InjectionType;
    private constructor();
    get isNewable(): boolean;
}

declare enum InstanceScope {
    SINGLETON = 'ioc-resolution:container-singleton',
    TRANSIENT = 'ioc-resolution:transient',
    GLOBAL_SHARED_SINGLETON = 'ioc-resolution:global-shared-singleton'
}

declare enum Lifecycle {
    PRE_INJECT = 'ioc-scope:pre-inject',
    POST_INJECT = 'ioc-scope:post-inject',
    PRE_DESTROY = 'ioc-scope:pre-destroy'
}

type MemberKey = string | symbol | number;

type KeyOf<T> = keyof T extends never ? MemberKey : keyof T;

interface MarkInfo {
    [key: string | symbol]: unknown;
}
declare class MarkInfoContainer {
    private readonly map;
    getMarkInfo(method: MemberKey): MarkInfo;
    mark(method: MemberKey, key: MemberKey, value: unknown): void;
    getMembers(): Set<MemberKey>;
}
declare class ParameterMarkInfoContainer {
    private readonly map;
    getMarkInfo(method: MemberKey): Record<number, MarkInfo>;
    mark(method: MemberKey, index: number, key: MemberKey, value: unknown): void;
}
interface ClassMarkInfo {
    ctor: MarkInfo;
    members: MarkInfoContainer;
    params: ParameterMarkInfoContainer;
}
interface ClassMetadataReader<T> extends MetadataReader {
    getClass(): Newable<T>;
    getScope(): InstanceScope | string | undefined;
    getConstructorParameterTypes(): Array<InjectionType>;
    getMethods(lifecycle: Lifecycle): Array<string | symbol>;
    getPropertyTypeMap(): Map<string | symbol, InjectionType>;
    getCtorMarkInfo(): MarkInfo;
    getAllMarkedMembers(): Set<MemberKey>;
    getMembersMarkInfo(methodKey: KeyOf<T>): MarkInfo;
    getParameterMarkInfo(methodKey: KeyOf<T>): Record<number, MarkInfo>;
}
declare class ClassMetadata<T> implements Metadata<ClassMetadataReader<T>, Newable<T>> {
    static getReflectKey(): string;
    private scope?;
    private constructorParameterTypes;
    private readonly lifecycleMethodsMap;
    private readonly propertyTypesMap;
    private clazz;
    private readonly marks;
    static getInstance<T>(ctor: Newable<T>): ClassMetadata<any>;
    static getReader<T>(ctor: Newable<T>): ClassMetadataReader<any>;
    init(target: Newable<T>): void;
    marker(): {
        ctor: (key: string | symbol, value: unknown) => void;
        member: (propertyKey: string | symbol | number) => {
            mark: (key: string | symbol, value: unknown) => void;
        };
        parameter: (
            propertyKey: string | symbol,
            index: number
        ) => {
            mark: (key: string | symbol, value: unknown) => void;
        };
    };
    setScope(scope: InstanceScope | string): void;
    setConstructorParameterType(index: number, type: InjectionType): void;
    recordPropertyType(propertyKey: string | symbol, type: InjectionType): void;
    addLifecycleMethod(methodName: string | symbol, lifecycle: Lifecycle): void;
    private getLifecycles;
    getMethods(lifecycle: Lifecycle): Array<string | symbol>;
    private getSuperClass;
    private getSuperClassMetadata;
    reader(): ClassMetadataReader<T>;
}

type AnyFunction<R = any, T = void> = (this: T, ...args: any[]) => R;

type ServiceFactory<R, O> = (container: ApplicationContext, owner?: O) => AnyFunction<R>;

declare class ServiceFactoryDef<T> {
    readonly identifier: Identifier;
    readonly scope: InstanceScope | string;
    static createFromClassMetadata<T>(metadata: ClassMetadata<T>): ServiceFactoryDef<unknown>;
    readonly factories: Map<ServiceFactory<T, unknown>, Identifier[]>;
    /**
     * @param identifier The unique identifier of this factories
     * @param isSingle Indicates whether the identifier defines only one factory.
     */
    constructor(identifier: Identifier, scope: InstanceScope | string);
    append(factory: ServiceFactory<T, unknown>, injections?: Identifier[]): void;
    produce(container: ApplicationContext, owner?: unknown): () => T[];
}

interface ApplicationContextOptions {
    defaultScope?: InstanceScope;
    lazyMode?: boolean;
}

interface EvaluationOptions<O, E extends string, A = unknown> {
    type: E;
    owner?: O;
    propertyName?: string | symbol;
    externalArgs?: A;
}
declare enum ExpressionType {
    ENV = 'inject-environment-variables',
    JSON_PATH = 'inject-json-data',
    ARGV = 'inject-argv'
}

interface Evaluator {
    eval<T, A = unknown>(context: ApplicationContext, expression: string, args?: A): T | undefined;
}

type FactoryIdentifier = string | symbol;

interface SaveInstanceOptions<T, O> {
    identifier: Identifier<T>;
    instance: T;
    owner?: O;
    ownerPropertyKey?: KeyOf<T>;
}
interface GetInstanceOptions<T, O> {
    identifier: Identifier<T>;
    owner?: O;
    ownerPropertyKey?: KeyOf<T>;
}
interface InstanceResolution {
    shouldGenerate<T, Owner>(options: GetInstanceOptions<T, Owner>): boolean;
    saveInstance<T, Owner>(options: SaveInstanceOptions<T, Owner>): void;
    getInstance<T, Owner>(options: GetInstanceOptions<T, Owner>): T | undefined;
    destroy(): void;
    destroyThat?<T>(instance: T): void;
}

interface InstantiationAwareProcessor {
    beforeInstantiation<T>(constructor: Newable<T>, args: unknown[]): T | undefined | undefined;
    afterInstantiation<T extends object>(instance: T): T;
}
interface PartialInstAwareProcessor extends Partial<InstantiationAwareProcessor> {}

type Primary = string | number | boolean | null;
interface JsonMap {
    [member: string]: Primary | JSONArray | JsonMap;
}
type JSONArray = Array<Primary | JsonMap | JSONArray>;
type JSONData$1 = JsonMap | JSONArray | Primary;

type EventListener = AnyFunction;

type InvokeFunctionArgs = {
    args?: unknown[];
};
type InvokeFunctionInjections = {
    injections: Identifier[];
};
type InvokeFunctionBasicOptions<T> = {
    context?: T;
};
type InvokeFunctionOptions<T> =
    | (InvokeFunctionBasicOptions<T> & InvokeFunctionArgs)
    | (InvokeFunctionBasicOptions<T> & Partial<InvokeFunctionInjections>);

declare class ApplicationContext {
    private readonly resolutions;
    private readonly factories;
    private readonly evaluatorClasses;
    private readonly eventEmitter;
    private readonly defaultScope;
    private readonly lazyMode;
    private readonly instAwareProcessorManager;
    private isDestroyed;
    constructor(options?: ApplicationContextOptions);
    getInstance<T, O>(symbol: Newable<T>, owner?: O): T;
    getInstance<T, O>(symbol: Identifier<T>, owner?: O): T | T[];
    private getInstanceBySymbol;
    private getInstanceByClass;
    private attachPreDestroyHook;
    private createComponentInstanceBuilder;
    getFactory(key: FactoryIdentifier): ServiceFactoryDef<unknown> | undefined;
    bindFactory<T>(
        symbol: FactoryIdentifier,
        factory: ServiceFactory<T, unknown>,
        injections?: Identifier[],
        scope?: InstanceScope
    ): void;
    invoke<R, Ctx>(func: AnyFunction<R, Ctx>, options?: InvokeFunctionOptions<Ctx>): R;
    destroy(): void;
    evaluate<T, O, A>(expression: string, options: EvaluationOptions<O, string, A>): T | undefined;
    recordJSONData(namespace: string, data: JSONData$1): void;
    getJSONData(namespace: string): JSONData$1 | undefined;
    bindInstance<T>(identifier: string | symbol, instance: T): void;
    registerInstanceScopeResolution<T extends Newable<InstanceResolution>>(
        scope: InstanceScope | string,
        resolutionConstructor: T,
        constructorArgs?: ConstructorParameters<T>
    ): void;
    getScropeResolutionInstance(scope: InstanceScope | string): InstanceResolution | undefined;
    registerEvaluator(name: string, evaluatorClass: Newable<Evaluator>): void;
    /**
     * @description Registers an InstantiationAwareProcessor class to customize
     *      the instantiation process at various stages within the IoC
     * @deprecated Replaced with {@link registerBeforeInstantiationProcessor} and {@link registerAfterInstantiationProcessor}
     * @param {Newable<PartialInstAwareProcessor>} clazz
     * @see InstantiationAwareProcessor
     * @since 1.0.0
     */
    registerInstAwareProcessor(clazz: Newable<PartialInstAwareProcessor>): void;
    registerBeforeInstantiationProcessor(
        processor: <T>(constructor: Newable<T>, args: unknown[]) => T | undefined | undefined
    ): void;
    registerAfterInstantiationProcessor(processor: <T extends object>(instance: T) => T): void;
    onPreDestroy(listener: EventListener): () => void;
    onPreDestroyThat(listener: (instance: object) => void): () => void;
    getClassMetadata<T>(ctor: Newable<T>): ClassMetadataReader<T>;
    destroyTransientInstance<T>(instance: T): void;
}

interface Aspect {
    execute(ctx: JoinPoint): any;
}
interface ProceedingAspect {
    execute(ctx: ProceedingJoinPoint): any;
}
interface JoinPoint {
    target: any;
    methodName: string | symbol;
    arguments: any[];
    returnValue: any;
    error: any;
    advice: Advice;
    ctx: ApplicationContext;
}
interface ProceedingJoinPoint extends JoinPoint {
    proceed(args?: any[]): any;
}

type UseAspectMap = DefaultValueMap<string | symbol, DefaultValueMap<Advice, Array<Newable<Aspect>>>>;
interface UseAspectMetadataReader extends MetadataReader {
    getAspects(): UseAspectMap;
    getAspectsOf(methodName: string | symbol, advice: Advice): Array<Newable<Aspect>>;
}
declare class AOPClassMetadata implements Metadata<UseAspectMetadataReader, Newable<unknown>> {
    static getReflectKey(): string;
    private aspectMap;
    init(): void;
    append(methodName: string | symbol, advice: Advice, aspects: Array<Newable<Aspect>>): void;
    reader(): UseAspectMetadataReader;
}

type MemberIdentifier = string | symbol;
declare abstract class Pointcut {
    static combine(...pointcuts: Pointcut[]): OrPointcut;
    static of<T>(cls: Newable<T>, ...methodNames: MemberIdentifier[]): PrecitePointcut;
    /**
     * @deprecated
     */
    static testMatch<T>(cls: Newable<T>, regex: RegExp): MemberMatchPointcut;
    static match<T>(cls: Newable<T>, regex: RegExp): MemberMatchPointcut;
    static from(...classes: Array<Newable<unknown>>): {
        of: (...methodNames: MemberIdentifier[]) => OrPointcut;
        match: (regex: RegExp) => OrPointcut;
        /**
         * @deprecated
         */
        testMatch: (regex: RegExp) => OrPointcut;
    };
    static marked(type: string | symbol, value?: unknown): MarkedPointcut;
    static class<T>(cls: Newable<T>): ClassPointcut;
    abstract test(jpIdentifier: Identifier, jpMember: string | symbol): boolean;
}
declare class OrPointcut extends Pointcut {
    private pointcuts;
    constructor(pointcuts: Pointcut[]);
    test(jpIdentifier: Identifier, jpMember: string | symbol): boolean;
}
declare class PrecitePointcut extends Pointcut {
    private readonly methodEntries;
    constructor(methodEntries: Map<Identifier, Set<MemberIdentifier>>);
    test(jpIdentifier: Identifier, jpMember: string | symbol): boolean;
}
declare class MarkedPointcut extends Pointcut {
    private markedType;
    private markedValue;
    constructor(markedType: string | symbol, markedValue?: unknown);
    test(jpIdentifier: Identifier, jpMember: string | symbol): boolean;
}
declare class MemberMatchPointcut extends Pointcut {
    private clazz;
    private regex;
    constructor(clazz: Newable<unknown>, regex: RegExp);
    test(jpIdentifier: Identifier, jpMember: string | symbol): boolean;
}
declare class ClassPointcut extends Pointcut {
    private clazz;
    constructor(clazz: Newable<unknown>);
    test(jpIdentifier: Identifier): boolean;
}

interface AspectInfo<T> {
    aspectClass: Newable<T>;
    methodName: string | symbol;
    advice: Advice;
    pointcut: Pointcut;
}

declare abstract class ComponentMethodAspect implements Aspect {
    static create(clazz: Newable<unknown>, methodName: string | symbol): Newable<Aspect>;
    protected aspectInstance: any;
    abstract execute(ctx: JoinPoint): any;
}

declare function After(pointcut: Pointcut): MethodDecorator;

declare function AfterReturn(pointcut: Pointcut): MethodDecorator;

declare function Around(pointcut: Pointcut): MethodDecorator;

declare function Before(pointcut: Pointcut): MethodDecorator;

declare function Finally(pointcut: Pointcut): MethodDecorator;

declare function Thrown(pointcut: Pointcut): MethodDecorator;

declare function UseAspects(advice: Advice.Around, aspects: Array<Newable<ProceedingAspect>>): MethodDecorator;
declare function UseAspects(advice: Advice, aspects: Array<Newable<Aspect>>): MethodDecorator;

declare function Alias(aliasName: string | symbol): ClassDecorator;

declare function Argv(name: string, argv?: string[]): PropertyDecorator;

/**
 * @deprecated use @Alias instead
 * @param aliasName
 * @returns
 */
declare function Bind(aliasName: string | symbol): ClassDecorator;

declare function Env(name: string): PropertyDecorator;

declare function Factory(produceIdentifier?: FactoryIdentifier, scope?: InstanceScope): MethodDecorator;

declare function Generate<T, V>(generator: (this: T, appCtx: ApplicationContext) => V): PropertyDecorator;

declare function Inject<T>(
    identifier?: Identifier<T>
): <Target>(target: Target, propertyKey: string | symbol, parameterIndex?: number) => void;

interface InjectableOptions {
    produce: string | symbol | Array<string | symbol>;
    scope?: InstanceScope;
}
/**
 * This decorator is typically used to identify classes that need to be configured within the IoC container.
 * In most cases, @Injectable can be omitted unless explicit configuration is required.
 */
declare function Injectable(options?: InjectableOptions): ClassDecorator;

declare function InstAwareProcessor(): <Cls extends Newable<PartialInstAwareProcessor>>(target: Cls) => Cls;

declare function JSONData(namespace: string, jsonpath: string): PropertyDecorator;

/**
 * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
 * @annotation
 */
declare const LifecycleDecorator: (lifecycle: Lifecycle) => MethodDecorator;

declare function Mark(key: string | symbol, value?: unknown): Function;

/**
 * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
 * @annotation
 */
declare const PostInject: () => MethodDecorator;

declare const PreDestroy: () => MethodDecorator;

/**
 * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
 * @annotation
 */
declare const PreInject: () => MethodDecorator;

declare function Scope(scope: InstanceScope | string): ClassDecorator;

declare function Value<A = unknown>(expression: string, type: ExpressionType | string, externalArgs?: A): PropertyDecorator;

declare const FUNCTION_METADATA_KEY: unique symbol;
interface FunctionMetadataReader {
    getParameters(): Identifier[];
    isFactory(): boolean;
    getScope(): InstanceScope | undefined;
}
declare class FunctionMetadata implements Metadata<FunctionMetadataReader, Function> {
    static getReflectKey(): symbol;
    private readonly parameters;
    private scope?;
    private isFactory;
    setParameterType(index: number, symbol: Identifier): void;
    setScope(scope: InstanceScope): void;
    setIsFactory(isFactory: boolean): void;
    init(): void;
    reader(): {
        getParameters: () => Identifier[];
        isFactory: () => boolean;
        getScope: () => InstanceScope | undefined;
    };
}

interface GlobalMetadataReader {
    getComponentFactory<T>(key: FactoryIdentifier): ServiceFactoryDef<T> | undefined;
    getClassMetadata<T>(aliasName: string | symbol): ClassMetadata<T> | undefined;
    getInstAwareProcessorClasses(): Array<Newable<PartialInstAwareProcessor>>;
}
declare class GlobalMetadata implements Metadata<GlobalMetadataReader, void> {
    private static readonly INSTANCE;
    static getInstance(): GlobalMetadata;
    static getReader(): {
        getComponentFactory: <T>(key: FactoryIdentifier) => ServiceFactoryDef<T> | undefined;
        getClassMetadata: <T>(aliasName: string | symbol) => ClassMetadata<T> | undefined;
        getInstAwareProcessorClasses: () => Array<Newable<PartialInstAwareProcessor>>;
    };
    private classAliasMetadataMap;
    private componentFactories;
    private readonly processorClasses;
    recordFactory<T>(
        symbol: FactoryIdentifier,
        factory: ServiceFactory<T, unknown>,
        injections?: Identifier[],
        scope?: InstanceScope | string
    ): void;
    recordClassAlias<T>(aliasName: string | symbol, metadata: ClassMetadata<T>): void;
    recordProcessorClass(clazz: Newable<PartialInstAwareProcessor>): void;
    init(): void;
    reader(): {
        getComponentFactory: <T>(key: FactoryIdentifier) => ServiceFactoryDef<T> | undefined;
        getClassMetadata: <T>(aliasName: string | symbol) => ClassMetadata<T> | undefined;
        getInstAwareProcessorClasses: () => Array<Newable<PartialInstAwareProcessor>>;
    };
}

declare function createFactoryWrapper<T>(produceIdentifier: FactoryIdentifier, produce: unknown, owner: T): T;

export {
    AOPClassMetadata,
    Advice,
    After,
    AfterReturn,
    Alias,
    ApplicationContext,
    Argv,
    Around,
    type Aspect,
    type AspectInfo,
    Before,
    Bind,
    type ClassMarkInfo,
    ClassMetadata,
    type ClassMetadataReader,
    ComponentMethodAspect,
    Env,
    type EvaluationOptions,
    type Evaluator,
    ExpressionType,
    FUNCTION_METADATA_KEY,
    Factory,
    Finally,
    FunctionMetadata,
    type FunctionMetadataReader,
    Generate,
    type GetInstanceOptions,
    GlobalMetadata,
    type GlobalMetadataReader,
    type Identifier,
    Inject,
    Injectable,
    type InjectableOptions,
    InjectionType,
    InstAwareProcessor,
    type InstanceResolution,
    InstanceScope,
    type InstantiationAwareProcessor,
    JSONData,
    type JoinPoint,
    Lifecycle,
    LifecycleDecorator,
    Mark,
    type MarkInfo,
    MarkInfoContainer,
    type MemberKey,
    type Newable,
    ParameterMarkInfoContainer,
    type PartialInstAwareProcessor,
    Pointcut,
    PostInject,
    PreDestroy,
    PreInject,
    type ProceedingAspect,
    type ProceedingJoinPoint,
    type SaveInstanceOptions,
    Scope,
    Thrown,
    type UseAspectMap,
    type UseAspectMetadataReader,
    UseAspects,
    Value,
    createFactoryWrapper
};
