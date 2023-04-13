import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { Lifecycle } from '../foundation/Lifecycle';

export function invokePreDestroy(instance: unknown) {
    const clazz = instance?.constructor;
    if (!clazz) {
        return;
    }
    const metadata = MetadataInstanceManager.getMetadata(clazz, ClassMetadata);
    const preDestroyMethods = metadata.getMethods(Lifecycle.PRE_DESTROY);
    preDestroyMethods.forEach(methodName => {
        const method = clazz.prototype[methodName];
        if (typeof method === 'function') {
            method.apply(instance);
        }
    });
}
