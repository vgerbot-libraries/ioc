import { Metadata, MetadataReader } from '../types/Metadata';
import { Newable } from '../types/Newable';
import { Aspect } from './Aspect';
import { DefaultValueMap } from '../common/DefaultValueMap';
import { AdviceEnum } from './AdviceEnum';

export type UseAspectMap = Map<string | symbol, Map<AdviceEnum, Array<Newable<Aspect>>>>;

export interface UseAspectMetadataReader extends MetadataReader {
    getAspects(): UseAspectMap;
    getAspectsOf(methodName: string | symbol, advice: AdviceEnum): Array<Newable<Aspect>>;
}
export class AOPClassMetadata implements Metadata<UseAspectMetadataReader, Newable<unknown>> {
    static getReflectKey() {
        return 'aop:use-aspect-metadata';
    }
    private aspectMap: UseAspectMap = new DefaultValueMap(() => new DefaultValueMap(() => []));
    init(): void {
        // IGNORE
    }

    append(methodName: string | symbol, advice: AdviceEnum, aspects: Array<Newable<Aspect>>) {
        const adviceAspectMap = this.aspectMap.get(methodName)!;
        const exitingAspectArray = adviceAspectMap.get(advice)!;
        exitingAspectArray.push(...aspects);
    }

    reader(): UseAspectMetadataReader {
        return {
            getAspects: (): UseAspectMap => {
                return this.aspectMap;
            },
            getAspectsOf: (methodName: string | symbol, advice: AdviceEnum) => {
                return this.aspectMap.get(methodName)!.get(advice)!;
            }
        };
    }
}
