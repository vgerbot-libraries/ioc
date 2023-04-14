/* eslint-disable @typescript-eslint/no-explicit-any */
import { Aspect, JoinPoint } from './Aspect';
import { ApplicationContext } from '../foundation/ApplicationContext';
import { Newable } from '../types/Newable';
import { Inject } from '../decorators/Inject';
import { lazyProp } from '@vgerbot/lazy';

export abstract class ComponentMethodAspect implements Aspect {
    public static create(clazz: Newable<unknown>, methodName: string | symbol): Newable<Aspect> {
        return class ComponentMethodAspectImpl extends ComponentMethodAspect {
            constructor() {
                super();
                lazyProp(this, 'aspectInstance', {
                    evaluate: () => this.appCtx.getInstance(clazz)
                });
            }
            execute(ctx: JoinPoint): any {
                const func = this.aspectInstance[methodName];
                return func.call(this.aspectInstance, ctx);
            }
        };
    }
    protected aspectInstance!: any;
    @Inject(ApplicationContext)
    protected appCtx!: ApplicationContext;
    abstract execute(ctx: JoinPoint): any;
}
