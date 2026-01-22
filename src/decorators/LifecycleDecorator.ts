import 'reflect-metadata';
import type { Lifecycle } from '../foundation/Lifecycle';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';

/**
 * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
 * @annotation
 */
export const LifecycleDecorator = (lifecycle: Lifecycle): MethodDecorator => {
    return (target: object, propertyKey: string | symbol) => {
        const metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
        metadata.addLifecycleMethod(propertyKey, lifecycle);
    };
};
