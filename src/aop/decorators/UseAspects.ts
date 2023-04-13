import { Advice } from '../Advice';
import { Aspect, ProceedingAspect } from '../Aspect';
import { MetadataInstanceManager } from '../../metadata/MetadataInstanceManager';
import { AOPClassMetadata } from '../AOPClassMetadata';
import { Newable } from '../../types/Newable';

function UseAspects(advice: Advice.Around, aspects: Array<Newable<ProceedingAspect>>): MethodDecorator;
function UseAspects(advice: Advice, aspects: Array<Newable<Aspect>>): MethodDecorator;
function UseAspects(advice: Advice, aspects: Array<Newable<Aspect>>): MethodDecorator {
    return function (target, propertyKey) {
        const clazz = target.constructor;
        const metadata = MetadataInstanceManager.getMetadata(clazz, AOPClassMetadata);
        metadata.append(propertyKey, advice, aspects);
    };
}

export { UseAspects };
