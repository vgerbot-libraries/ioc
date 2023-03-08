import { Pointcut } from '../Pointcut';
import { AdviceEnum } from '../AdviceEnum';
import { addAspect } from '../addAspect';
import { Newable } from '../../types/Newable';

export function Finally(pointcut: Pointcut): MethodDecorator {
    return function (target, propertyKey) {
        addAspect(target.constructor as Newable<unknown>, propertyKey, AdviceEnum.TryFinally, pointcut);
    };
}
