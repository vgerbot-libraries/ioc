/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApplicationContext } from '../foundation/ApplicationContext';
import { Advice } from './Advice';
import { Newable } from '../types/Newable';
import { Aspect, JoinPoint, ProceedingJoinPoint } from './Aspect';
import { AspectUtils } from './AspectUtils';
import { AspectInfo } from './AspectMetadta';

export function createAspect<T>(
    appCtx: ApplicationContext,
    target: T,
    methodName: string | symbol,
    methodFunc: Function,
    aspects: AspectInfo[]
) {
    const createAspectCtx = (advice: Advice, args: any[], returnValue: any = null, error: any = null): JoinPoint => {
        return {
            target,
            methodName,
            arguments: args,
            returnValue,
            error,
            advice,
            ctx: appCtx
        };
    };
    const aspectUtils = new AspectUtils(methodFunc as (...args: any[]) => any);
    const ClassToInstance = (aspectInfo: AspectInfo) => appCtx.getInstance(aspectInfo.aspectClass) as Aspect;
    const targetConstructor = (target as object).constructor as Newable<T>;
    const allMatchAspects = aspects.filter(it => it.pointcut.test(targetConstructor, methodName));

    const beforeAdviceAspects = allMatchAspects.filter(it => it.advice === Advice.Before).map(ClassToInstance);
    const afterAdviceAspects = allMatchAspects.filter(it => it.advice === Advice.After).map(ClassToInstance);
    const tryCatchAdviceAspects = allMatchAspects.filter(it => it.advice === Advice.Thrown).map(ClassToInstance);
    const tryFinallyAdviceAspects = allMatchAspects.filter(it => it.advice === Advice.Finally).map(ClassToInstance);
    const afterReturnAdviceAspects = allMatchAspects.filter(it => it.advice === Advice.AfterReturn).map(ClassToInstance);
    const aroundAdviceAspects = allMatchAspects.filter(it => it.advice === Advice.Around).map(ClassToInstance);

    if (beforeAdviceAspects.length > 0) {
        aspectUtils.append(Advice.Before, (args: any[]) => {
            const joinPoint = createAspectCtx(Advice.Before, args);
            beforeAdviceAspects.forEach(aspect => {
                aspect.execute(joinPoint);
            });
        });
    }
    if (afterAdviceAspects.length > 0) {
        aspectUtils.append(Advice.After, (args: any[]) => {
            const joinPoint = createAspectCtx(Advice.After, args);
            afterAdviceAspects.forEach(aspect => {
                aspect.execute(joinPoint);
            });
        });
    }
    if (tryCatchAdviceAspects.length > 0) {
        aspectUtils.append(Advice.Thrown, (error, args) => {
            const joinPoint = createAspectCtx(Advice.Thrown, args, null, error);
            tryCatchAdviceAspects.forEach(aspect => {
                aspect.execute(joinPoint);
            });
        });
    }

    if (tryFinallyAdviceAspects.length > 0) {
        aspectUtils.append(Advice.Finally, (args: any[]) => {
            const joinPoint = createAspectCtx(Advice.Finally, args);
            tryFinallyAdviceAspects.forEach(aspect => {
                aspect.execute(joinPoint);
            });
        });
    }

    if (afterReturnAdviceAspects.length > 0) {
        aspectUtils.append(Advice.AfterReturn, (returnValue, args) => {
            return afterReturnAdviceAspects.reduce((prevReturnValue, aspect) => {
                const joinPoint = createAspectCtx(Advice.AfterReturn, args, returnValue);
                return aspect.execute(joinPoint);
            }, returnValue);
        });
    }

    if (aroundAdviceAspects.length > 0) {
        aroundAdviceAspects.forEach(aspect => {
            aspectUtils.append(Advice.Around, (originFn, args) => {
                const joinPoint = createAspectCtx(Advice.Around, args, null) as ProceedingJoinPoint;
                joinPoint.proceed = (jpArgs = args) => {
                    return originFn(jpArgs);
                };
                return aspect.execute(joinPoint);
            });
        });
    }

    return aspectUtils.extract();
}
