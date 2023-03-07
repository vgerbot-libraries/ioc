/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApplicationContext } from '../foundation/ApplicationContext';
import { AdviceEnum } from './AdviceEnum';
import { Newable } from '../types/Newable';
import { Aspect, JoinPoint, ProceedingJoinPoint } from './Aspect';
import { defineLazyProperty } from '../utils/defineLazyProperty';
import { AspectUtils } from './AspectUtils';

export function createAspect<T>(
    appCtx: ApplicationContext,
    target: T,
    methodName: string | symbol,
    methodFunc: Function,
    adviceAspectMap: Map<AdviceEnum, Map<Newable<unknown>, Set<string | symbol>>>
) {
    const createAspectCtx = (
        advice: AdviceEnum,
        args: any[],
        returnValue: any = null,
        error: any = null,
        aspectParams: any = null
    ): JoinPoint => {
        return {
            target,
            methodName,
            functionParams: args,
            returnValue,
            error,
            advice,
            aspectParams
        };
    };
    const aspectUtils = new AspectUtils(methodFunc as (...args: any[]) => any);

    if (adviceAspectMap.has(AdviceEnum.Before)) {
        const aspectClassMap = adviceAspectMap.get(AdviceEnum.Before)!;
        const aspects = convertAspectClassMapToAspectList(appCtx, aspectClassMap);
        aspectUtils.append(AdviceEnum.Before, (args: any[]) => {
            const ctx = createAspectCtx(AdviceEnum.Before, args);
            aspects.forEach(aspect => {
                aspect.execute(ctx);
            });
        });
    }
    if (adviceAspectMap.has(AdviceEnum.After)) {
        const aspectClassMap = adviceAspectMap.get(AdviceEnum.After)!;
        const aspects = convertAspectClassMapToAspectList(appCtx, aspectClassMap);
        aspectUtils.append(AdviceEnum.After, (args: any[]) => {
            const joinPoint = createAspectCtx(AdviceEnum.After, args);
            aspects.forEach(aspect => {
                aspect.execute(joinPoint);
            });
        });
    }
    if (adviceAspectMap.has(AdviceEnum.TryCatch)) {
        const aspectClassMap = adviceAspectMap.get(AdviceEnum.TryCatch)!;
        const aspects = convertAspectClassMapToAspectList(appCtx, aspectClassMap);
        aspectUtils.append(AdviceEnum.TryCatch, (error, args) => {
            const joinPoint = createAspectCtx(AdviceEnum.TryCatch, args, null, error);
            aspects.forEach(aspect => {
                aspect.execute(joinPoint);
            });
        });
    }

    if (adviceAspectMap.has(AdviceEnum.TryFinally)) {
        const aspectClassMap = adviceAspectMap.get(AdviceEnum.TryFinally)!;
        const aspects = convertAspectClassMapToAspectList(appCtx, aspectClassMap);
        aspectUtils.append(AdviceEnum.TryFinally, (args: any[]) => {
            const joinPoint = createAspectCtx(AdviceEnum.TryFinally, args);
            aspects.forEach(aspect => {
                aspect.execute(joinPoint);
            });
        });
    }

    if (adviceAspectMap.has(AdviceEnum.AfterReturn)) {
        const aspectClassMap = adviceAspectMap.get(AdviceEnum.AfterReturn)!;
        const aspects = convertAspectClassMapToAspectList(appCtx, aspectClassMap);
        aspectUtils.append(AdviceEnum.AfterReturn, (returnValue, args) => {
            aspects.reduce((prevReturnValue, aspect) => {
                const joinPoint = createAspectCtx(AdviceEnum.AfterReturn, args, returnValue);
                return aspect.execute(joinPoint);
            }, returnValue);
        });
    }

    if (adviceAspectMap.has(AdviceEnum.Around)) {
        const aspectClassMap = adviceAspectMap.get(AdviceEnum.Around)!;
        const aspects = convertAspectClassMapToAspectList(appCtx, aspectClassMap);
        aspects.forEach(aspect => {
            aspectUtils.append(AdviceEnum.Around, (originFn, args) => {
                const joinPoint = createAspectCtx(AdviceEnum.Around, args, null) as ProceedingJoinPoint;
                joinPoint.proceed = (jpArgs = args) => {
                    return originFn(jpArgs);
                };
                return aspect.execute(joinPoint);
            });
        });
    }

    return aspectUtils.extract();
}

function convertAspectClassMapToAspectList(
    appCtx: ApplicationContext,
    aspectClassMap: Map<Newable<unknown>, Set<string | symbol>>
) {
    const aspects: Aspect[] = [];
    aspectClassMap.forEach((methods, clazz) => {
        methods.forEach(method => {
            aspects.push(new ComponentAspect(appCtx, clazz, method));
        });
    });
    return aspects;
}

class ComponentAspect implements Aspect {
    private aspectInstance!: any;
    constructor(appCtx: ApplicationContext, clazz: Newable<unknown>, private readonly methodName: string | symbol) {
        defineLazyProperty(this, 'aspectInstance', () => {
            return appCtx.getInstance(clazz);
        });
    }
    execute(ctx: JoinPoint): any {
        const func = this.aspectInstance[this.methodName];
        return func.call(this.aspectInstance, ctx);
    }
}
