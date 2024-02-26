import { Newable } from '../types';
import { Identifier } from '../types/Identifier';
import { Metadata, MetadataReader } from '../types/Metadata';
import { Advice } from './Advice';
import { ComponentMethodAspect } from './ComponentMethodAspect';
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

export class AspectMetadata implements Metadata<AspectMetadataReader, void> {
    private static INSTANCE = new AspectMetadata();
    private readonly aspects: AspectInfo[] = [];
    public static getInstance() {
        return AspectMetadata.INSTANCE;
    }
    private constructor() {
        //
    }
    init(): void {
        //
    }
    append(componentAspectClass: Newable<unknown>, methodName: string | symbol, advice: Advice, pointcut: Pointcut) {
        const AspectClass = ComponentMethodAspect.create(componentAspectClass, methodName);
        this.aspects.push({
            aspectClass: AspectClass,
            methodName,
            pointcut,
            advice
        });
    }
    reader(): AspectMetadataReader {
        return {
            getAspects: (jpIdentifier, jpMember) => {
                return this.aspects.filter(({ pointcut }) => {
                    return pointcut.test(jpIdentifier, jpMember);
                });
            }
        };
    }
}
