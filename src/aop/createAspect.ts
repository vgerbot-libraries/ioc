/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApplicationContext } from '../foundation/ApplicationContext';
import { AdviceEnum } from './AdviceEnum';
import { Newable } from '../types/Newable';
import { Aspect, JoinPoint, ProceedingJoinPoint } from './Aspect';
import { AspectUtils } from './AspectUtils';
import { UseAspectMetadataReader } from './AOPClassMetadata';

export function createAspect<T>(
    appCtx: ApplicationContext,
    target: T,
    methodName: string | symbol,
    methodFunc: Function,
    metadata: UseAspectMetadataReader
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
    const ClassToInstance = (AspectClass: Newable<Aspect>) => appCtx.getInstance(AspectClass);
    const beforeAdviceAspects = metadata.getAspectsOf(methodName, AdviceEnum.Before).map(ClassToInstance);
    const afterAdviceAspects = metadata.getAspectsOf(methodName, AdviceEnum.After).map(ClassToInstance);
    const tryCatchAdviceAspects = metadata.getAspectsOf(methodName, AdviceEnum.TryCatch).map(ClassToInstance);
    const tryFinallyAdviceAspects = metadata.getAspectsOf(methodName, AdviceEnum.TryFinally).map(ClassToInstance);
    const afterReturnAdviceAspects = metadata.getAspectsOf(methodName, AdviceEnum.AfterReturn).map(ClassToInstance);
    const aroundAdviceAspects = metadata.getAspectsOf(methodName, AdviceEnum.Around).map(ClassToInstance);

    if (beforeAdviceAspects.length > 0) {
        aspectUtils.append(AdviceEnum.Before, (args: any[]) => {
            const joinPoint = createAspectCtx(AdviceEnum.Before, args);
            beforeAdviceAspects.forEach(aspect => {
                aspect.execute(joinPoint);
            });
        });
    }
    if (afterAdviceAspects.length > 0) {
        aspectUtils.append(AdviceEnum.After, (args: any[]) => {
            const joinPoint = createAspectCtx(AdviceEnum.After, args);
            afterAdviceAspects.forEach(aspect => {
                aspect.execute(joinPoint);
            });
        });
    }
    if (tryCatchAdviceAspects.length > 0) {
        aspectUtils.append(AdviceEnum.TryCatch, (error, args) => {
            const joinPoint = createAspectCtx(AdviceEnum.TryCatch, args, null, error);
            tryCatchAdviceAspects.forEach(aspect => {
                aspect.execute(joinPoint);
            });
        });
    }

    if (tryFinallyAdviceAspects.length > 0) {
        aspectUtils.append(AdviceEnum.TryFinally, (args: any[]) => {
            const joinPoint = createAspectCtx(AdviceEnum.TryFinally, args);
            tryFinallyAdviceAspects.forEach(aspect => {
                aspect.execute(joinPoint);
            });
        });
    }

    if (afterReturnAdviceAspects.length > 0) {
        aspectUtils.append(AdviceEnum.AfterReturn, (returnValue, args) => {
            afterReturnAdviceAspects.reduce((prevReturnValue, aspect) => {
                const joinPoint = createAspectCtx(AdviceEnum.AfterReturn, args, returnValue);
                return aspect.execute(joinPoint);
            }, returnValue);
        });
    }

    if (aroundAdviceAspects.length > 0) {
        aroundAdviceAspects.forEach(aspect => {
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
