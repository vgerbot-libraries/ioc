import { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';
import { MetadataFactory } from '../metadata/MetadataFactory';
import { AspectClassMetadata } from './AspectClassMetadata';
import type { ApplicationContext } from '../foundation/ApplicationContext';
import { createAspect } from './createAspect';

export class AOPInstantiationAwareProcessor implements PartialInstAwareProcessor {
    constructor(private readonly appCtx: ApplicationContext) {}
    afterInstantiation<T extends object>(instance: T): T {
        const clazz = instance.constructor;
        const metadata = MetadataFactory.getMetadata(clazz, AspectClassMetadata);
        if (!metadata.reader().isAdviceClass()) {
            return instance;
        }

        const aspectStoreMap = new WeakMap<object, Map<string | symbol, Function>>();
        aspectStoreMap.set(instance, new Map<string | symbol, Function>());

        const proxyResult = new Proxy(instance, {
            get: (target, prop) => {
                const originValue = (target as Record<string | symbol, unknown>)[prop];
                if (prop in target && typeof originValue === 'function') {
                    const aspectMap = aspectStoreMap.get(instance)!;
                    if (aspectMap.has(prop)) {
                        return aspectMap.get(prop);
                    }
                    const adviceAspectMap = metadata.reader().getAdviceAspectMap(prop);
                    const aspectFn = createAspect(this.appCtx, target, prop, originValue, adviceAspectMap);
                    aspectMap.set(prop, aspectFn);
                    return aspectFn;
                }
                return originValue;
            }
        });
        return proxyResult;
    }
}
