import { Advice } from '../Advice';
import { Aspect, ProceedingAspect } from '../Aspect';
import { Newable } from '../../types/Newable';
import { addAspect } from '../addAspect';
import { Pointcut } from '../Pointcut';

function UseAspects(advice: Advice.Around, aspects: Array<Newable<ProceedingAspect>>): MethodDecorator;
function UseAspects(advice: Advice, aspects: Array<Newable<Aspect>>): MethodDecorator;
function UseAspects(advice: Advice, aspects: Array<Newable<Aspect>>): MethodDecorator {
    return function (target, propertyKey) {
        const clazz = target.constructor as Newable<typeof target>;
        aspects.forEach(aspectClass => {
            addAspect(aspectClass, 'execute', advice, Pointcut.of(clazz, propertyKey));
        });
    };
}

export { UseAspects };
