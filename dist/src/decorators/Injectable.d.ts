import { InstanceScope } from '../foundation';
export interface InjectableOptions {
    produce: string | symbol | Array<string | symbol>;
    scope?: InstanceScope;
}
/**
 * This decorator is typically used to identify classes that need to be configured within the IoC container.
 * In most cases, @Injectable can be omitted unless explicit configuration is required.
 */
export declare function Injectable(options?: InjectableOptions): ClassDecorator;
