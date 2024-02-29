/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aspect, JoinPoint } from './Aspect';
import { Newable } from '../types/Newable';

export abstract class ComponentMethodAspect implements Aspect {
    public static create(clazz: Newable<unknown>, methodName: string | symbol): Newable<Aspect> {
        return class ComponentMethodAspectImpl extends ComponentMethodAspect {
            execute(jp: JoinPoint): any {
                const aspectInstance = jp.ctx.getInstance(clazz) as any;
                const func = aspectInstance[methodName];
                return func.call(this.aspectInstance, jp);
            }
        };
    }
    protected aspectInstance!: any;
    abstract execute(ctx: JoinPoint): any;
}
