import { Pointcut } from './Pointcut';
import { Newable } from '../types/Newable';
import { ComponentMethodAspect } from './ComponentMethodAspect';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';
import { AOPClassMetadata } from './AOPClassMetadata';
import { Advice } from './Advice';

export function addAspect(
    componentAspectClass: Newable<unknown>,
    methodName: string | symbol,
    advice: Advice,
    pointcut: Pointcut
) {
    const AspectClass = ComponentMethodAspect.create(componentAspectClass, methodName);
    pointcut.getMethodsMap().forEach((jpMembers, jpClass) => {
        const metadata = MetadataInstanceManager.getMetadata(jpClass, AOPClassMetadata);
        jpMembers.forEach(methodName => {
            metadata.append(methodName, advice, [AspectClass]);
        });
    });
}
