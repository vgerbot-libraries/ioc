import { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';
import type { ApplicationContext } from '../foundation/ApplicationContext';
import { createAspect } from './createAspect';
import { Newable } from '../types/Newable';
import { AspectMetadata } from './AspectMetadta';
import { Identifier } from '../types/Identifier';

export abstract class AOPInstantiationAwareProcessor implements PartialInstAwareProcessor {
    static create(appCtx: ApplicationContext): Newable<AOPInstantiationAwareProcessor> {
        return class extends AOPInstantiationAwareProcessor {
            protected readonly appCtx: ApplicationContext = appCtx;
        };
    }
    protected abstract readonly appCtx: ApplicationContext;
    afterInstantiation<T extends object>(instance: T): T {
        if (!instance || typeof instance !== 'object') {
            return instance;
        }
        const clazz = instance.constructor;

        const aspectMetadata = AspectMetadata.getInstance().reader();
        // const useAspectMetadata = MetadataInstanceManager.getMetadata(clazz, AOPClassMetadata);
        // const useAspectMetadataReader = useAspectMetadata.reader();
        // const useAspectsMap = useAspectMetadataReader.getAspects();
        // if (useAspectsMap.size === 0) {
        //     return instance;
        // }

        const aspectStoreMap = new WeakMap<object, Map<string | symbol, Function>>();
        aspectStoreMap.set(instance, new Map<string | symbol, Function>());

        const proxyResult = new Proxy(instance, {
            get: (target, prop, receiver) => {
                const originValue = Reflect.get(target, prop, receiver);
                switch (prop) {
                    case 'constructor':
                        return originValue;
                }
                if (Reflect.has(target, prop) && typeof originValue === 'function') {
                    const aspectMap = aspectStoreMap.get(instance);
                    if (!aspectMap) {
                        return originValue;
                    }
                    if (aspectMap.has(prop)) {
                        return aspectMap.get(prop);
                    }
                    const aspectsOfMethod = aspectMetadata.getAspects(clazz as Identifier, prop);
                    const aspectFn = createAspect(this.appCtx, target, prop, originValue, aspectsOfMethod);
                    aspectMap.set(prop, aspectFn);
                    return aspectFn;
                }
                return originValue;
            }
        });
        return proxyResult;
    }
}
