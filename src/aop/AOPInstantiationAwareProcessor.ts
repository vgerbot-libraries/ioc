import { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';
import { MetadataFactory } from '../metadata/MetadataFactory';
import type { ApplicationContext } from '../foundation/ApplicationContext';
import { createAspect } from './createAspect';
import { AOPClassMetadata } from './AOPClassMetadata';
import { Newable } from '../types/Newable';

export abstract class AOPInstantiationAwareProcessor implements PartialInstAwareProcessor {
    static create(appCtx: ApplicationContext): Newable<AOPInstantiationAwareProcessor> {
        return class extends AOPInstantiationAwareProcessor {
            protected readonly appCtx: ApplicationContext = appCtx;
        };
    }
    protected abstract readonly appCtx: ApplicationContext;
    afterInstantiation<T extends object>(instance: T): T {
        const clazz = instance.constructor;

        const useAspectMetadata = MetadataFactory.getMetadata(clazz, AOPClassMetadata);
        const useAspectMetadataReader = useAspectMetadata.reader();
        const useAspectsMap = useAspectMetadataReader.getAspects();
        if (useAspectsMap.size === 0) {
            return instance;
        }

        const aspectStoreMap = new WeakMap<object, Map<string | symbol, Function>>();
        aspectStoreMap.set(instance, new Map<string | symbol, Function>());

        const proxyResult = new Proxy(instance, {
            get: (target, prop) => {
                const originValue = (target as Record<string | symbol, unknown>)[prop];
                if (prop in target && typeof originValue === 'function') {
                    const aspectMap = aspectStoreMap.get(instance);
                    if (!aspectMap) {
                        return originValue;
                    }
                    if (aspectMap.has(prop)) {
                        return aspectMap.get(prop);
                    }
                    const aspectFn = createAspect(this.appCtx, target, prop, originValue, useAspectMetadataReader);
                    aspectMap.set(prop, aspectFn);
                    return aspectFn;
                }
                return originValue;
            }
        });
        return proxyResult;
    }
}
