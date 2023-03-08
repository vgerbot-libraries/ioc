import { Advice } from '../Advice';
import { Aspect } from '../Aspect';
import { MetadataFactory } from '../../metadata/MetadataFactory';
import { AOPClassMetadata } from '../AOPClassMetadata';
import { Newable } from '../../types/Newable';

export function UseAspects(advice: Advice, aspects: Array<Newable<Aspect>>): MethodDecorator {
    return function (target, propertyKey) {
        const clazz = target.constructor;
        const metadata = MetadataFactory.getMetadata(clazz, AOPClassMetadata);
        metadata.append(propertyKey, advice, aspects);
    };
}
