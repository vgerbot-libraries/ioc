import { Aspect, JoinPoint } from './Aspect';
import { ApplicationContext } from '../foundation/ApplicationContext';
import { Newable } from '../types/Newable';
export declare abstract class ComponentMethodAspect implements Aspect {
    static create(clazz: Newable<unknown>, methodName: string | symbol): Newable<Aspect>;
    protected aspectInstance: any;
    protected appCtx: ApplicationContext;
    abstract execute(ctx: JoinPoint): any;
}
