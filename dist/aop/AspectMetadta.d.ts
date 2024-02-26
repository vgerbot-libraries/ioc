import { Newable } from '../types';
import { Identifier } from '../types/Identifier';
import { Metadata, MetadataReader } from '../types/Metadata';
import { Advice } from './Advice';
import { Pointcut } from './Pointcut';
export interface AspectInfo {
    aspectClass: Newable<unknown>;
    methodName: string | symbol;
    pointcut: Pointcut;
    advice: Advice;
}
export interface AspectMetadataReader extends MetadataReader {
    getAspects(jpIdentifier: Identifier, jpMember: string | symbol): AspectInfo[];
}
export declare class AspectMetadata implements Metadata<AspectMetadataReader, void> {
    private static INSTANCE;
    private readonly aspects;
    static getInstance(): AspectMetadata;
    private constructor();
    init(): void;
    append(componentAspectClass: Newable<unknown>, methodName: string | symbol, advice: Advice, pointcut: Pointcut): void;
    reader(): AspectMetadataReader;
}
