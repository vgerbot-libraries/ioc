import { Metadata, MetadataReader } from '../types/Metadata';
import { Newable } from '../types/Newable';
import { Aspect } from './Aspect';
import { createDefaultValueMap, DefaultValueMap } from '../common/DefaultValueMap';
import { Advice } from './Advice';

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
                return this.aspectMap.get(methodName).get(advice)!;
            }
        };
    }
}
