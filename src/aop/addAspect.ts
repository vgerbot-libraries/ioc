import { Pointcut } from './Pointcut';
import { Newable } from '../types/Newable';
import { ComponentMethodAspect } from './ComponentMethodAspect';
import { MetadataFactory } from '../metadata/MetadataFactory';
import { AOPClassMetadata } from './AOPClassMetadata';
import { AdviceEnum } from './AdviceEnum';

export function addAspect(
    componentAspectClass: Newable<unknown>,
    methodName: string | symbol,
    advice: AdviceEnum,
    pointcut: Pointcut
) {
    const AspectClass = ComponentMethodAspect.create(componentAspectClass, methodName);
    pointcut.getMethodsMap().forEach((jpMembers, jpClass) => {
        const metadata = MetadataFactory.getMetadata(jpClass, AOPClassMetadata);
        jpMembers.forEach(methodName => {
            metadata.append(methodName, advice, [AspectClass]);
        });
    });
}
