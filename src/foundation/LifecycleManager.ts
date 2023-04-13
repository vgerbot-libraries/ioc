import { Newable } from '../types/Newable';
import { ClassMetadata, ClassMetadataReader } from '../metadata/ClassMetadata';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';
import { Lifecycle } from './Lifecycle';
import { Instance } from '../types/Instance';
import { ApplicationContext } from './ApplicationContext';

export class LifecycleManager<T = unknown> {
    private classMetadataReader: ClassMetadataReader<T>;
    constructor(private readonly componentClass: Newable<T>, private readonly container: ApplicationContext) {
        this.classMetadataReader = MetadataInstanceManager.getMetadata(this.componentClass, ClassMetadata).reader();
    }
    invokePreInjectMethod(instance: Instance<T>) {
        const methods = this.classMetadataReader.getMethods(Lifecycle.PRE_INJECT);
        this.invokeLifecycleMethods(instance, methods);
    }
    invokePostInjectMethod(instance: Instance<T>) {
        const methods = this.classMetadataReader.getMethods(Lifecycle.POST_INJECT);
        this.invokeLifecycleMethods(instance, methods);
    }
    invokePreDestroyInjectMethod(instance: Instance<T>) {
        const methods = this.classMetadataReader.getMethods(Lifecycle.PRE_DESTROY);
        this.invokeLifecycleMethods(instance, methods);
    }
    private invokeLifecycleMethods(instance: Instance<T>, methodKeys: Array<string | symbol>) {
        methodKeys.forEach(key => {
            this.container.invoke(instance[key], {
                context: instance
            });
        });
    }
}
