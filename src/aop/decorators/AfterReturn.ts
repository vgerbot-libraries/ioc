import type { Newable } from '../../types/Newable';
import { Advice } from '../Advice';
import { addAspect } from '../addAspect';
import type { Pointcut } from '../Pointcut';

export function AfterReturn(pointcut: Pointcut): MethodDecorator {
    return (target, propertyKey) => {
        addAspect(target.constructor as Newable<unknown>, propertyKey, Advice.AfterReturn, pointcut);
    };
}
