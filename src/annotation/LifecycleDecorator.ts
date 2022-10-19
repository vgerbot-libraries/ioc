import 'reflect-metadata';
import { Lifecycle } from '../foundation/Lifecycle';
import { MethodMetadata } from '../metadata/MethodMetadata';

/**
 * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
 * @annotation
 */
export const LifecycleDecorator = (lifecycle: Lifecycle): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol) => {
        const metadata = MethodMetadata.record(target);
        metadata.addLifecycle(propertyKey, lifecycle);
    };
};
