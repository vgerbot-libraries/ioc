import { InstanceScope } from './InstanceScope';
import { InstanceGenerationGuard } from './InstanceGenerationGuard';
import { Constructor } from './Constructor';
import { TypeSymbol } from './TypeSymbol';
import { ComponentFactory } from './ComponentFactory';
import { EventEmitter, EventListener } from './EventEmitter';
import { UnknownTypeInstance } from './UnknownTypeInstance';

const PRE_DESTROY_EVENT_KEY = 'container:event:pre-destroy';

export class ComponentContainer {
    private guards = new Map<InstanceScope | string, InstanceGenerationGuard>();
    private factories = new Map<TypeSymbol, ComponentFactory>();
    private eventEmitter = new EventEmitter();
    private constructor() {
        // PASS
    }

    getComponentInstance<T = unknown>(symbol: TypeSymbol<T>, owner?: UnknownTypeInstance): T {
        return null as unknown as T;
    }
    factory(symbol: TypeSymbol, factory: ComponentFactory) {
        this.factories.set(symbol, factory);
    }
    invoke<TFunction extends Function = Function>(func: TFunction, context?: unknown) {
        if (arguments.length > 1) {
            func = func.bind(context);
        }
        // TODO: INJECT AND INVOKE
        return func();
    }
    destroy() {
        // PASS
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
