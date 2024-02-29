import { InstanceScope } from './InstanceScope';
import { InstanceResolution } from '../types/InstanceResolution';
import { Identifier } from '../types/Identifier';
import { ServiceFactory } from '../types/ServiceFactory';
import { EventListener } from './EventEmitter';
import { AnyFunction } from '../types/AnyFunction';
import { InvokeFunctionOptions } from './InvokeFunctionOptions';
import { FactoryIdentifier } from '../types/FactoryIdentifier';
import { ClassMetadataReader } from '../metadata/ClassMetadata';
import { ApplicationContextOptions } from '../types/ApplicationContextOptions';
import { Newable } from '../types/Newable';
import { EvaluationOptions } from '../types/EvaluateOptions';
import { JSONData } from '../types/JSONData';
import { Evaluator } from '../types/Evaluator';
import { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';
export declare class ApplicationContext {
    private resolutions;
    private factories;
    private evaluatorClasses;
    private eventEmitter;
    private readonly defaultScope;
    private readonly lazyMode;
    private readonly instAwareProcessorManager;
    private isDestroyed;
    constructor(options?: ApplicationContextOptions);
    getInstance<T, O>(symbol: Newable<T>, owner?: O): T;
    getInstance<T, O>(symbol: Identifier<T>, owner?: O): T | T[];
    private createComponentInstanceBuilder;
    getFactory(key: FactoryIdentifier): import("./ServiceFactoryDef").ServiceFactoryDef<unknown> | undefined;
    bindFactory<T>(symbol: FactoryIdentifier, factory: ServiceFactory<T, unknown>, injections?: Identifier[], isSingle?: boolean): void;
    invoke<R, Ctx>(func: AnyFunction<R, Ctx>, options?: InvokeFunctionOptions<Ctx>): R;
    destroy(): void;
    evaluate<T, O, A>(expression: string, options: EvaluationOptions<O, string, A>): T | undefined;
    recordJSONData(namespace: string, data: JSONData): void;
    getJSONData(namespace: string): JSONData | undefined;
    bindInstance<T>(identifier: string | symbol, instance: T): void;
    registerInstanceScopeResolution<T extends Newable<InstanceResolution>>(scope: InstanceScope | string, resolutionConstructor: T, constructorArgs?: ConstructorParameters<T>): void;
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
    registerBeforeInstantiationProcessor(processor: <T>(constructor: Newable<T>, args: unknown[]) => T | undefined | void): void;
    registerAfterInstantiationProcessor(processor: <T extends object>(instance: T) => T): void;
    onPreDestroy(listener: EventListener): () => void;
    getClassMetadata<T>(ctor: Newable<T>): ClassMetadataReader<T>;
    destroyTransientInstance<T>(instance: T): void;
}
