import { Pointcut } from '../Pointcut';
import { AdviceEnum } from '../AdviceEnum';
import { addAspect } from '../addAspect';
import { Newable } from '../../types/Newable';

export function Thrown(pointcut: Pointcut): MethodDecorator {
    return function (target, propertyKey) {
        addAspect(target.constructor as Newable<unknown>, propertyKey, AdviceEnum.TryCatch, pointcut);
    };
}
