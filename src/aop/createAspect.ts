/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApplicationContext } from '../foundation/ApplicationContext';
import { Advice } from './Advice';
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
    const createAspectCtx = (advice: Advice, args: any[], returnValue: any = null, error: any = null): JoinPoint => {
        return {
            target,
            methodName,
            arguments: args,
            returnValue,
            error,
            advice
        };
    };
    const aspectUtils = new AspectUtils(methodFunc as (...args: any[]) => any);
    const ClassToInstance = (AspectClass: Newable<Aspect>) => appCtx.getInstance(AspectClass);
    const beforeAdviceAspects = metadata.getAspectsOf(methodName, Advice.Before).map(ClassToInstance);
    const afterAdviceAspects = metadata.getAspectsOf(methodName, Advice.After).map(ClassToInstance);
    const tryCatchAdviceAspects = metadata.getAspectsOf(methodName, Advice.Thrown).map(ClassToInstance);
    const tryFinallyAdviceAspects = metadata.getAspectsOf(methodName, Advice.Finally).map(ClassToInstance);
    const afterReturnAdviceAspects = metadata.getAspectsOf(methodName, Advice.AfterReturn).map(ClassToInstance);
    const aroundAdviceAspects = metadata.getAspectsOf(methodName, Advice.Around).map(ClassToInstance);

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
            afterReturnAdviceAspects.reduce((prevReturnValue, aspect) => {
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
