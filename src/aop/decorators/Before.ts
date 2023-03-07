import { Pointcut } from '../Pointcut';
import { MetadataFactory } from '../../metadata/MetadataFactory';
import { AspectClassMetadata } from '../AspectClassMetadata';
import { AdviceEnum } from '../AdviceEnum';
import { Newable } from '../../types/Newable';

export function Before(pointcut: Pointcut): MethodDecorator {
    return function (target, propertyKey) {
        const clazz = target.constructor as Newable<unknown>;
        MetadataFactory.getMetadata(clazz, AspectClassMetadata).recordAspectInfo({
            aspectClass: clazz,
            methodName: propertyKey,
            advice: AdviceEnum.Before,
            pointcut
        });
    };
}
