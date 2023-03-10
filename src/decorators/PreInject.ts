import 'reflect-metadata';
import { Lifecycle } from '../foundation/Lifecycle';
import { LifecycleDecorator } from './LifecycleDecorator';

/**
 * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
 * @annotation
 */
export const PreInject = (): MethodDecorator => LifecycleDecorator(Lifecycle.PRE_INJECT);
