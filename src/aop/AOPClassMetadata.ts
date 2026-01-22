import { createDefaultValueMap, type DefaultValueMap } from '../common/DefaultValueMap';
import type { Metadata, MetadataReader } from '../types/Metadata';
import type { Newable } from '../types/Newable';
import type { Advice } from './Advice';
import type { Aspect } from './Aspect';

export type UseAspectMap = DefaultValueMap<string | symbol, DefaultValueMap<Advice, Array<Newable<Aspect>>>>;

export interface UseAspectMetadataReader extends MetadataReader {
    getAspects(): UseAspectMap;
    getAspectsOf(methodName: string | symbol, advice: Advice): Array<Newable<Aspect>>;
}
export class AOPClassMetadata implements Metadata<UseAspectMetadataReader, Newable<unknown>> {
    static getReflectKey() {
        return 'aop:use-aspect-metadata';
    }
    private aspectMap: UseAspectMap = createDefaultValueMap(() => createDefaultValueMap(() => []));
    init(): void {
        // IGNORE
    }

    append(methodName: string | symbol, advice: Advice, aspects: Array<Newable<Aspect>>) {
        const adviceAspectMap = this.aspectMap.get(methodName);
        const exitingAspectArray = adviceAspectMap.get(advice);
        exitingAspectArray.push(...aspects);
    }

    reader(): UseAspectMetadataReader {
        return {
            getAspects: (): UseAspectMap => {
                return this.aspectMap;
            },
            getAspectsOf: (methodName: string | symbol, advice: Advice) => {
                return this.aspectMap.get(methodName).get(advice);
            }
        };
    }
}
