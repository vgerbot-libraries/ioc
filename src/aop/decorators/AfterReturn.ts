import { Pointcut } from '../Pointcut';
import { Advice } from '../Advice';
import { addAspect } from '../addAspect';
import { Newable } from '../../types/Newable';

export function AfterReturn(pointcut: Pointcut): MethodDecorator {
    return function (target, propertyKey) {
        addAspect(target.constructor as Newable<unknown>, propertyKey, Advice.AfterReturn, pointcut);
    };
}
