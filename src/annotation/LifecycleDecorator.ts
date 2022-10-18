import 'reflect-metadata';
import { Lifecycle } from '../foundation/Lifecycle';
import { METADATA_KEY, MethodMemberMetadata } from '../foundation/MemberMetadata';

/**
 * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
 * @annotation
 */
export const LifecycleDecorator = (lifecycle: Lifecycle): MethodDecorator => {
    return <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
        const method = descriptor.get ? descriptor.get() : descriptor.value;
        if (!method) {
            return;
        }
        const originMetadataValue = (Reflect.getMetadata(METADATA_KEY, method) || {}) as Partial<MethodMemberMetadata>;
        const originLifecycles = originMetadataValue.lifecycle || [];
        const lifecycles = originLifecycles.indexOf(lifecycle) === -1 ? originLifecycles.concat(lifecycle) : originLifecycles;

        Reflect.defineMetadata(
            METADATA_KEY,
            {
                ...originMetadataValue,
                lifecycle: lifecycles
            } as Partial<MethodMemberMetadata>,
            method
        );
    };
};
