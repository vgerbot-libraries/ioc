import type { Newable } from '../../types/Newable';
import type { Advice } from '../Advice';
import type { Aspect, ProceedingAspect } from '../Aspect';
import { addAspect } from '../addAspect';
import { Pointcut } from '../Pointcut';

function UseAspects(advice: Advice.Around, aspects: Array<Newable<ProceedingAspect>>): MethodDecorator;
function UseAspects(advice: Advice, aspects: Array<Newable<Aspect>>): MethodDecorator;
function UseAspects(advice: Advice, aspects: Array<Newable<Aspect>>): MethodDecorator {
    return (target, propertyKey) => {
        const clazz = target.constructor as Newable<typeof target>;
        aspects.forEach(aspectClass => {
            addAspect(aspectClass, 'execute', advice, Pointcut.of(clazz, propertyKey));
        });
    };
}

export { UseAspects };
