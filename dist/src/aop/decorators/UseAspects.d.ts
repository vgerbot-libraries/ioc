import { Advice } from '../Advice';
import { Aspect, ProceedingAspect } from '../Aspect';
import { Newable } from '../../types/Newable';
declare function UseAspects(advice: Advice.Around, aspects: Array<Newable<ProceedingAspect>>): MethodDecorator;
declare function UseAspects(advice: Advice, aspects: Array<Newable<Aspect>>): MethodDecorator;
export { UseAspects };
