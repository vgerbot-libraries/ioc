import { GlobalMetadata } from '../metadata/GlobalMetadata';
import { ComponentClass } from '../foundation/ComponentClass';

export function Factory(type: string | symbol): MethodDecorator {
    return (target: Object, propertyKey: string | symbol, descriptor) => {
        const metadata = GlobalMetadata.getInstance();
        const clazz = target.constructor as ComponentClass;
        metadata.recordFactory(type, (container, owner) => {
            const instance = container.getComponentInstance(clazz, owner);
            const func = descriptor.get !== undefined ? descriptor.get.call(instance) : descriptor.value;
            if (typeof func === 'function') {
                return {
                    value: container.invoke(func, instance)
                };
            } else {
                return {
                    value: func
                };
            }
        });
    };
}
