import 'reflect-metadata';
import { Lifecycle } from '../foundation/Lifecycle';
/**
 * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
 * @annotation
 */
export declare const LifecycleDecorator: (lifecycle: Lifecycle) => MethodDecorator;
