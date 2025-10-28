import { AOPInstantiationAwareProcessor } from '../aop/AOPInstantiationAwareProcessor';
import { FactoryRecorder } from '../common/FactoryRecorder';
import { isNodeJs } from '../common/isNodeJs';
import { ArgvEvaluator } from '../evaluator/ArgvEvaluator';
import { EnvironmentEvaluator } from '../evaluator/EnvironmentEvaluator';
import { JSONDataEvaluator } from '../evaluator/JSONDataEvaluator';
import { ClassMetadata, ClassMetadataReader } from '../metadata/ClassMetadata';
import { FunctionMetadata } from '../metadata/FunctionMetadata';
import { GlobalMetadata } from '../metadata/GlobalMetadata';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';
import { GlobalSharedInstanceResolution } from '../resolution/GlobalSharedInstanceResolution';
import { SingletonInstanceResolution } from '../resolution/SingletonInstanceResolution';
import { TransientInstanceResolution } from '../resolution/TransientInstanceResolution';
import { AnyFunction } from '../types/AnyFunction';
import { ApplicationContextOptions } from '../types/ApplicationContextOptions';
import { EvaluationOptions, ExpressionType } from '../types/EvaluateOptions';
import { Evaluator } from '../types/Evaluator';
import { FactoryIdentifier } from '../types/FactoryIdentifier';
import { Identifier } from '../types/Identifier';
import { Instance } from '../types/Instance';
import { InstanceResolution } from '../types/InstanceResolution';
import { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';
import { JSONData } from '../types/JSONData';
import { Newable } from '../types/Newable';
import { ServiceFactory } from '../types/ServiceFactory';
import { ComponentInstanceBuilder } from './ComponentInstanceBuilder';
import { EventEmitter, EventListener } from './EventEmitter';
import { InstanceScope } from './InstanceScope';
import { InstantiationAwareProcessorManager } from './InstantiationAwareProcessorManager';
import { hasArgs, hasInjections, InvokeFunctionOptions } from './InvokeFunctionOptions';
import { Lifecycle } from './Lifecycle';
import { LifecycleManager } from './LifecycleManager';

const PRE_DESTROY_EVENT_KEY = 'container:event:pre-destroy';
const PRE_DESTROY_THAT_EVENT_KEY = 'container:event:pre-destroy-that';
const INSTANCE_PRE_DESTROY_METHOD = Symbol('solidium:instance-pre-destroy');

export class ApplicationContext {
    private readonly resolutions = new Map<InstanceScope | string, InstanceResolution>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly factories = new FactoryRecorder();
    private readonly evaluatorClasses = new Map<string, Newable<Evaluator>>();
    private readonly eventEmitter = new EventEmitter();
    private readonly defaultScope: InstanceScope;
    private readonly lazyMode: boolean;
    private readonly instAwareProcessorManager: InstantiationAwareProcessorManager;
    private isDestroyed = false;
    public constructor(options: ApplicationContextOptions = {}) {
        this.defaultScope = options.defaultScope || InstanceScope.SINGLETON;
        this.lazyMode = options.lazyMode ?? true;
        this.registerInstanceScopeResolution(InstanceScope.SINGLETON, SingletonInstanceResolution);
        this.registerInstanceScopeResolution(InstanceScope.GLOBAL_SHARED_SINGLETON, GlobalSharedInstanceResolution);
        this.registerInstanceScopeResolution(InstanceScope.TRANSIENT, TransientInstanceResolution);
        this.registerEvaluator(ExpressionType.JSON_PATH, JSONDataEvaluator);
        if (isNodeJs) {
            this.registerEvaluator(ExpressionType.ENV, EnvironmentEvaluator);
            this.registerEvaluator(ExpressionType.ARGV, ArgvEvaluator);
        }
        this.instAwareProcessorManager = new InstantiationAwareProcessorManager(this);
        this.registerInstAwareProcessor(AOPInstantiationAwareProcessor.create(this));
    }
    getInstance<T, O>(symbol: Newable<T>, owner?: O): T;
    getInstance<T, O>(symbol: Identifier<T>, owner?: O): T | T[];
    getInstance<T, O>(symbol: Identifier<T>, owner?: O): T | T[] {
        if (typeof symbol === 'string' || typeof symbol === 'symbol') {
            return this.getInstanceBySymbol(symbol, owner);
        }
        return this.getInstanceByClass(symbol, owner);
    }
    private getInstanceBySymbol<T, O>(symbol: string | symbol, owner?: O): T | T[] {
        const factoryDef = this.getFactory(symbol);
        if (factoryDef) {
            const producer = factoryDef.produce(this, owner);

            const resolution = this.getScropeResolutionInstance(factoryDef.scope)!;
            if (
                !resolution.shouldGenerate({
                    identifier: symbol,
                    owner
                })
            ) {
                return resolution.getInstance({
                    identifier: symbol,
                    owner
                }) as T;
            }
            const instances = producer() as T[];

            const results = instances.map(it => {
                this.attachPreDestroyHook(it);
                const constr = it?.constructor;
                if (typeof constr === 'function') {
                    const componentClass = constr as Newable<T>;
                    const resolver = new LifecycleManager<T>(componentClass, this);
                    const isInstAwareProcessor = this.instAwareProcessorManager.isInstAwareProcessorClass(componentClass);
                    resolver.invokePreInjectMethod(it as Instance<T>);
                    if (!isInstAwareProcessor) {
                        it = this.instAwareProcessorManager.afterInstantiation(it as Instance<T>);
                    }
                    resolver.invokePostInjectMethod(it as Instance<T>);
                }
                resolution.saveInstance({
                    identifier: symbol,
                    instance: it
                });
                return it;
            });
            return results.length === 1 ? results[0] : results;
        } else {
            const classMetadata = GlobalMetadata.getInstance().reader().getClassMetadata<T>(symbol);
            if (!classMetadata) {
                throw new Error(`Class alias not found: ${symbol.toString()}`);
            } else {
                const clazz = classMetadata.reader().getClass();
                return this.getInstanceByClass(clazz, owner);
            }
        }
    }
    private getInstanceByClass<T, O>(componentClass: Newable<T>, owner?: O): T | T[] {
        if (componentClass === ApplicationContext) {
            return this as unknown as T;
        }
        const reader = ClassMetadata.getInstance(componentClass).reader();
        const scope = reader.getScope();
        const resolution = (this.resolutions.get(scope ?? this.defaultScope) ||
            this.resolutions.get(this.defaultScope)) as InstanceResolution;
        const getInstanceOptions = {
            identifier: componentClass,
            owner,
            ownerPropertyKey: undefined
        };
        if (resolution.shouldGenerate(getInstanceOptions)) {
            const builder = this.createComponentInstanceBuilder(componentClass);
            const instance = builder.build();
            const saveInstanceOptions = {
                ...getInstanceOptions,
                instance
            };
            resolution.saveInstance(saveInstanceOptions);
            this.attachPreDestroyHook(instance);
            return instance;
        } else {
            return resolution.getInstance(getInstanceOptions) as T;
        }
    }
    private attachPreDestroyHook<T>(instances: T | T[]) {
        const instancesArray = Array.isArray(instances) ? instances : [instances];
        instancesArray.forEach(it => {
            const instance = it as Instance<T>;
            if (typeof instance !== 'object' || instance === null) {
                return;
            }
            if (Reflect.has(instance, INSTANCE_PRE_DESTROY_METHOD)) {
                return;
            }
            const clazz = instance.constructor;
            if (!clazz) {
                return;
            }
            const metadata = MetadataInstanceManager.getMetadata(instance.constructor, ClassMetadata);

            metadata.addLifecycleMethod(INSTANCE_PRE_DESTROY_METHOD, Lifecycle.PRE_DESTROY);
            Reflect.set(instance, INSTANCE_PRE_DESTROY_METHOD, () => {
                this.eventEmitter.emit(PRE_DESTROY_EVENT_KEY, instance);
            });
        });
    }
    private createComponentInstanceBuilder<T>(componentClass: Newable<T>) {
        const builder = new ComponentInstanceBuilder(componentClass, this, this.instAwareProcessorManager);
        builder.appendLazyMode(this.lazyMode);
        return builder;
    }

    getFactory(key: FactoryIdentifier) {
        const factory = GlobalMetadata.getInstance().reader().getComponentFactory(key);
        if (!factory) {
            return this.factories.get(key);
        }
        return factory;
    }
    bindFactory<T>(
        symbol: FactoryIdentifier,
        factory: ServiceFactory<T, unknown>,
        injections?: Identifier[],
        scope: InstanceScope = InstanceScope.SINGLETON
    ) {
        this.factories.append(symbol, factory, injections, scope);
    }
    invoke<R, Ctx>(func: AnyFunction<R, Ctx>, options: InvokeFunctionOptions<Ctx> = {}): R {
        let fn: AnyFunction<R>;
        if (arguments.length > 1) {
            fn = func.bind(options.context as ThisParameterType<typeof func>) as AnyFunction<R>;
        } else {
            fn = func as AnyFunction<R>;
        }
        if (hasArgs(options)) {
            return options.args ? fn(...options.args) : fn();
        }
        let argsIndentifiers: Identifier[] = [];
        if (hasInjections(options)) {
            argsIndentifiers = options.injections;
        } else {
            const metadata = MetadataInstanceManager.getMetadata(fn, FunctionMetadata).reader();
            argsIndentifiers = metadata.getParameters();
        }
        const args = argsIndentifiers.map((identifier, index) => {
            const instance = this.getInstance(identifier);
            if (Array.isArray(instance)) {
                const isArrayType = (identifier as unknown) === Array;
                if (isArrayType) {
                    return instance;
                }
                if (instance.length > 1) {
                    throw new Error(`Multiple matching injectables found for parameter at ${index}.`);
                }
                return instance[0];
            }
            return instance;
        });
        return args.length > 0 ? fn(...args) : fn();
    }
    destroy() {
        if (this.isDestroyed) {
            return;
        }
        this.isDestroyed = true;
        this.eventEmitter.emit(PRE_DESTROY_EVENT_KEY);
        this.resolutions.forEach(it => {
            it.destroy();
        });
    }
    evaluate<T, O, A>(expression: string, options: EvaluationOptions<O, string, A>): T | undefined {
        const evaluatorClass = this.evaluatorClasses.get(options.type);
        if (!evaluatorClass) {
            throw new TypeError(`Unknown evaluator name: ${options.type}`);
        }
        const evaluator = this.getInstance(evaluatorClass);
        return evaluator.eval(this, expression, options.externalArgs);
    }
    recordJSONData(namespace: string, data: JSONData) {
        const evaluator = this.getInstance(JSONDataEvaluator);
        evaluator.recordData(namespace, data);
    }
    getJSONData(namespace: string) {
        const evaluator = this.getInstance(JSONDataEvaluator);
        return evaluator.getJSONData(namespace);
    }
    bindInstance<T>(identifier: string | symbol, instance: T) {
        const resolution = this.resolutions.get(InstanceScope.SINGLETON);
        resolution?.saveInstance({
            identifier,
            instance
        });
    }
    registerInstanceScopeResolution<T extends Newable<InstanceResolution>>(
        scope: InstanceScope | string,
        resolutionConstructor: T,
        constructorArgs?: ConstructorParameters<T>
    ) {
        this.resolutions.set(scope, new resolutionConstructor(...(constructorArgs ?? [])));
    }
    getScropeResolutionInstance(scope: InstanceScope | string) {
        return this.resolutions.get(scope) ?? this.resolutions.get(this.defaultScope);
    }
    registerEvaluator(name: string, evaluatorClass: Newable<Evaluator>) {
        const metadata = MetadataInstanceManager.getMetadata(evaluatorClass, ClassMetadata);
        metadata.setScope(InstanceScope.SINGLETON);
        this.evaluatorClasses.set(name, evaluatorClass);
    }
    /**
     * @description Registers an InstantiationAwareProcessor class to customize
     *      the instantiation process at various stages within the IoC
     * @deprecated Replaced with {@link registerBeforeInstantiationProcessor} and {@link registerAfterInstantiationProcessor}
     * @param {Newable<PartialInstAwareProcessor>} clazz
     * @see InstantiationAwareProcessor
     * @since 1.0.0
     */
    registerInstAwareProcessor(clazz: Newable<PartialInstAwareProcessor>) {
        this.instAwareProcessorManager.appendInstAwareProcessorClass(clazz);
    }
    registerBeforeInstantiationProcessor(processor: <T>(constructor: Newable<T>, args: unknown[]) => T | undefined | void) {
        this.instAwareProcessorManager.appendInstAwareProcessorClass(
            class InnerProcessor implements PartialInstAwareProcessor {
                beforeInstantiation<T>(constructor: Newable<T>, args: unknown[]): void | T | undefined {
                    return processor(constructor, args);
                }
            }
        );
    }
    registerAfterInstantiationProcessor(processor: <T extends object>(instance: T) => T) {
        this.instAwareProcessorManager.appendInstAwareProcessorClass(
            class InnerProcessor implements PartialInstAwareProcessor {
                afterInstantiation<T extends object>(instance: T): T {
                    return processor(instance);
                }
            }
        );
    }
    onPreDestroy(listener: EventListener) {
        return this.eventEmitter.on(PRE_DESTROY_EVENT_KEY, listener);
    }
    onPreDestroyThat(listener: (instance: object) => void) {
        return this.eventEmitter.on(PRE_DESTROY_THAT_EVENT_KEY, listener);
    }
    getClassMetadata<T>(ctor: Newable<T>) {
        return ClassMetadata.getReader(ctor) as ClassMetadataReader<T>;
    }
    destroyTransientInstance<T>(instance: T) {
        const resolution = this.resolutions.get(InstanceScope.TRANSIENT);
        resolution?.destroyThat && resolution.destroyThat(instance);
    }
}
