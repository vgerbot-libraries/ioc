import { InstanceScope } from './InstanceScope';
import { InstanceResolution } from '../types/InstanceResolution';
import { Identifier } from '../types/Identifier';
import { ServiceFactory } from '../types/ServiceFactory';
import { EventEmitter, EventListener } from './EventEmitter';
import { AnyFunction } from '../types/AnyFunction';
import { hasArgs, hasInjections, InvokeFunctionOptions } from './InvokeFunctionOptions';
import { GlobalMetadata } from '../metadata/GlobalMetadata';
import { FactoryIdentifier } from '../types/FactoryIdentifier';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { ComponentInstanceBuilder } from './ComponentInstanceBuilder';
import { FunctionMetadata } from '../metadata/FunctionMetadata';
import { ApplicationContextOptions } from '../types/ApplicationContextOptions';
import { Newable } from '../types/Newable';
import { MetadataFactory } from '../metadata/MetadataFactory';
import { ServiceFactoryDef } from './ServiceFactoryDef';
import { SingletonInstanceResolution } from '../resolution/SingletonInstanceResolution';
import { GlobalSharedInstanceResolution } from '../resolution/GlobalSharedInstanceResolution';
import { TransientInstanceResolution } from '../resolution/TransientInstanceResolution';
import { EvaluationOptions, ExpressionType } from '../types/EvaluateOptions';
import { JSONData } from '../types/JSONData';
import { Evaluator } from '../types/Evaluator';
import { JSONDataEvaluator } from '../evaluator/JSONDataEvaluator';
import { EnvironmentEvaluator } from '../evaluator/EnvironmentEvaluator';
import { ArgvEvaluator } from '../evaluator/ArgvEvaluator';
import { isNodeJs } from '../common/isNodeJs';

const PRE_DESTROY_EVENT_KEY = 'container:event:pre-destroy';

export class ApplicationContext {
    private resolutions = new Map<InstanceScope | string, InstanceResolution>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private factories = new Map<FactoryIdentifier, ServiceFactoryDef<any>>();
    private evaluatorClasses = new Map<string, Newable<Evaluator>>();
    private eventEmitter = new EventEmitter();
    private readonly defaultScope: InstanceScope;
    public constructor(private options: ApplicationContextOptions = {}) {
        this.defaultScope = this.options.defaultScope || InstanceScope.SINGLETON;
        this.registerInstanceScopeResolution(InstanceScope.SINGLETON, SingletonInstanceResolution);
        this.registerInstanceScopeResolution(InstanceScope.GLOBAL_SHARED_SINGLETON, GlobalSharedInstanceResolution);
        this.registerInstanceScopeResolution(InstanceScope.TRANSIENT, TransientInstanceResolution);
        this.registerEvaluator(ExpressionType.JSON_PATH, JSONDataEvaluator);
        if (isNodeJs) {
            this.registerEvaluator(ExpressionType.ENV, EnvironmentEvaluator);
            this.registerEvaluator(ExpressionType.ARGV, ArgvEvaluator);
        }
    }
    getInstance<T, O>(symbol: Identifier<T>, owner?: O): T {
        if (typeof symbol === 'string' || typeof symbol === 'symbol') {
            const factoryDef = this.getFactory(symbol);
            if (factoryDef) {
                const { factory, injections } = factoryDef;
                const fn = factory(this, owner);
                return this.invoke(fn, {
                    injections
                });
            } else {
                const classMetadata = GlobalMetadata.getInstance().reader().getClassMetadata<T>(symbol);
                if (!classMetadata) {
                    throw new Error('');
                } else {
                    symbol = classMetadata.reader().getClass();
                }
            }
        }
        const componentClass = symbol;
        const reader = MetadataFactory.getMetadata(componentClass, ClassMetadata).reader();
        const scope = reader.getScope();
        const resolution = (this.resolutions.get(scope) || this.resolutions.get(this.defaultScope)) as InstanceResolution;
        const getInstanceOptions = {
            identifier: componentClass,
            owner,
            ownerPropertyKey: undefined
        };
        if (resolution.shouldGenerate(getInstanceOptions)) {
            const builder = new ComponentInstanceBuilder(componentClass, this);
            builder.appendClassMetadata(reader);
            const instance = builder.build();
            const saveInstanceOptions = {
                ...getInstanceOptions,
                instance
            };
            resolution.saveInstance(saveInstanceOptions);
            return instance;
        } else {
            return resolution.getInstance(getInstanceOptions) as T;
        }
    }
    getFactory(key: FactoryIdentifier) {
        const factory = GlobalMetadata.getInstance().reader().getComponentFactory(key);
        if (!factory) {
            return this.factories.get(key);
        }
        return factory;
    }
    bindFactory<T>(symbol: FactoryIdentifier, factory: ServiceFactory<T, unknown>, injections?: Identifier[]) {
        this.factories.set(symbol, new ServiceFactoryDef(factory, injections));
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
        if (hasInjections(options)) {
            const args = options.injections ? options.injections.map(it => this.getInstance(it)) : [];
            return args.length > 0 ? fn(...args) : fn();
        }
        const metadata = MetadataFactory.getMetadata(fn, FunctionMetadata).reader();
        const parameterIdentifiers = metadata.getParameters();
        const args = parameterIdentifiers.map(identifier => {
            return this.getInstance(identifier);
        });
        return fn(...args);
    }
    destroy() {
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
        this.resolutions.set(scope, new resolutionConstructor(...(constructorArgs || [])));
    }
    registerEvaluator(name: string, evaluatorClass: Newable<Evaluator>) {
        const metadata = MetadataFactory.getMetadata(evaluatorClass, ClassMetadata);
        metadata.setScope(InstanceScope.SINGLETON);
        this.evaluatorClasses.set(name, evaluatorClass);
    }
    onPreDestroy(listener: EventListener) {
        return this.eventEmitter.on(PRE_DESTROY_EVENT_KEY, listener);
    }
}
