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

const PRE_DESTROY_EVENT_KEY = 'container:event:pre-destroy';

export class ApplicationContext {
    private resolutions = new Map<InstanceScope | string, InstanceResolution>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private factories = new Map<FactoryIdentifier, ServiceFactoryDef<any>>();
    private eventEmitter = new EventEmitter();
    private readonly defaultScope: InstanceScope;
    public constructor(private options: ApplicationContextOptions = {}) {
        this.defaultScope = this.options.defaultScope || InstanceScope.SINGLETON;
        this.registerInstanceScopeResolution(InstanceScope.SINGLETON, SingletonInstanceResolution);
        this.registerInstanceScopeResolution(InstanceScope.GLOBAL_SHARED_SINGLETON, GlobalSharedInstanceResolution);
        this.registerInstanceScopeResolution(InstanceScope.TRANSIENT, TransientInstanceResolution);
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
        if (resolution.shouldGenerate(componentClass, owner)) {
            const builder = new ComponentInstanceBuilder(componentClass, this);
            builder.appendClassMetadata(reader);
            const instance = builder.build();
            resolution.saveInstance(instance);
            return instance;
        } else {
            return resolution.getInstance(componentClass, owner) as T;
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
        this.resolutions.forEach(guard => {
            guard.destroy();
        });
    }
    evaluate<T>(expression: string, owner?: unknown): T {
        return null as T;
    }
    registerInstanceScopeResolution(
        scope: InstanceScope | string,
        guardConstructor: Newable<InstanceResolution>,
        constructorArgs: unknown[] = []
    ) {
        this.resolutions.set(scope, new guardConstructor(...constructorArgs));
    }
    onPreDestroy(listener: EventListener) {
        return this.eventEmitter.on(PRE_DESTROY_EVENT_KEY, listener);
    }
}
