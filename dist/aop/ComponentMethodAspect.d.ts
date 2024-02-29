import { Aspect, JoinPoint } from './Aspect';
import { Newable } from '../types/Newable';
export declare abstract class ComponentMethodAspect implements Aspect {
    static create(clazz: Newable<unknown>, methodName: string | symbol): Newable<Aspect>;
    protected aspectInstance: any;
    abstract execute(ctx: JoinPoint): any;
}
