import { InstanceScope } from './InstanceScope';
import { InstanceGenerationGuard } from './InstanceGenerationGuard';
import { Constructor } from './Constructor';
import { TypeSymbol } from './TypeSymbol';
import { ComponentFactory } from './ComponentFactory';
import { EventEmitter, EventListener } from './EventEmitter';
import { UnknownTypeInstance } from './UnknownTypeInstance';
import { AnyFunction } from '../types/AnyFunction';
import { InvokeFunctionOptions } from './InvokeFunctionOptions';
import { GlobalMetadata } from '../metadata/GlobalMetadata';
import { Key } from '../types/Key';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { Lifecycle } from './Lifecycle';

const PRE_DESTROY_EVENT_KEY = 'container:event:pre-destroy';

export class ApplicationContext {
    private guards = new Map<InstanceScope | string, InstanceGenerationGuard>();
    private factories = new Map<Key, ComponentFactory>();
    private eventEmitter = new EventEmitter();
    public constructor() {
        // PASS
    }
    getComponentInstance<T extends UnknownTypeInstance = UnknownTypeInstance>(
        symbol: TypeSymbol<T>,
        owner?: UnknownTypeInstance
    ): T {
        if (typeof symbol === 'string' || typeof symbol === 'symbol') {
            const factory = this.getFactory(symbol);
            if (!factory) {
                throw new Error('');
            }
            return this.invoke(factory as AnyFunction, {});
        }
        const componentClass = symbol;
        const reader = ClassMetadata.getMetadata(componentClass).reader();
        const scope = reader.getScope();
        const guard = (this.guards.get(scope) || this.guards.get(InstanceScope.SINGLETON)) as InstanceGenerationGuard;
        const invokeLifecycleMethods = (instance: any, lifecycle: Lifecycle) => {
            reader.getMethods(lifecycle).forEach(methodName => {
                this.invoke(instance[methodName] as AnyFunction, {
                    context: instance
                });
            });
        };
        if (guard.shouldGenerate(componentClass, owner)) {
            const parameterTypes = reader.getConstructorParameterTypes();
            const parameters = parameterTypes.map(type => {
                return this.getComponentInstance(type);
            });
            const instance: any = new componentClass(...parameters);
            invokeLifecycleMethods(instance, Lifecycle.PRE_INJECT);
            reader.getPropertyTypeMap().forEach((propertyType, propertyName) => {
                instance[propertyName] = this.getComponentInstance(propertyType, instance);
            });
            invokeLifecycleMethods(instance, Lifecycle.POST_INJECT);
            guard.saveInstance(instance);
            return instance;
        } else {
            return guard.getInstance(componentClass, owner) as T;
        }
    }
    private getFactory(key: Key) {
        const factory = GlobalMetadata.getInstance().reader().getComponentFactory(key);
        if (!factory) {
            return this.factories.get(key);
        }
    }
    factory(symbol: Key, factory: ComponentFactory) {
        this.factories.set(symbol, factory);
    }
    invoke<TFunction extends AnyFunction = AnyFunction>(
        func: TFunction,
        options: InvokeFunctionOptions<ThisType<TFunction>>
    ): ReturnType<TFunction> {
        if (arguments.length > 1) {
            func = func.bind(options.context) as TFunction;
        }
        // TODO: INJECT AND INVOKE
        return func();
    }
    destroy() {
        this.guards.forEach(guard => {
            guard.destroy();
        });
    }
    evaluate<T>(expression: string, owner?: unknown): T {
        return null as T;
    }
    registerGuard(
        scope: InstanceScope | string,
        guardConstructor: Constructor<InstanceGenerationGuard>,
        constructorArgs: unknown[] = []
    ) {
        this.guards.set(scope, new guardConstructor(...constructorArgs));
    }
    getGuard(scope: InstanceScope | string) {
        return this.guards.get(scope);
    }
    onPreDestroy(listener: EventListener) {
        return this.eventEmitter.on(PRE_DESTROY_EVENT_KEY, listener);
    }
}
