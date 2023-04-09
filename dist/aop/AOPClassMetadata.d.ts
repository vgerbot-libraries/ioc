import { Metadata, MetadataReader } from '../types/Metadata';
import { Newable } from '../types/Newable';
import { Aspect } from './Aspect';
import { DefaultValueMap } from '../common/DefaultValueMap';
import { Advice } from './Advice';
export type UseAspectMap = DefaultValueMap<string | symbol, DefaultValueMap<Advice, Array<Newable<Aspect>>>>;
export interface UseAspectMetadataReader extends MetadataReader {
    getAspects(): UseAspectMap;
    getAspectsOf(methodName: string | symbol, advice: Advice): Array<Newable<Aspect>>;
}
export declare class AOPClassMetadata implements Metadata<UseAspectMetadataReader, Newable<unknown>> {
    static getReflectKey(): string;
    private aspectMap;
    init(): void;
    append(methodName: string | symbol, advice: Advice, aspects: Array<Newable<Aspect>>): void;
    reader(): UseAspectMetadataReader;
}
