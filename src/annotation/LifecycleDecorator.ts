import 'reflect-metadata';
import { Lifecycle } from '../foundation/Lifecycle';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { MetadataFactory } from '../metadata/MetadataFactory';

/**
 * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
 * @annotation
 */
export const LifecycleDecorator = (lifecycle: Lifecycle): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol) => {
        const metadata = MetadataFactory.getMetadata(target.constructor, ClassMetadata);
        metadata.addLifecycleMethod(propertyKey, lifecycle);
    };
};
