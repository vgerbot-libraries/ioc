import type { Newable } from '../types/Newable';
import type { Advice } from './Advice';
import { AspectMetadata } from './AspectMetadta';
import type { Pointcut } from './Pointcut';

export function addAspect(
    componentAspectClass: Newable<unknown>,
    methodName: string | symbol,
    advice: Advice,
    pointcut: Pointcut
) {
    AspectMetadata.getInstance().append(componentAspectClass, methodName, advice, pointcut);
    // const AspectClass = ComponentMethodAspect.create(componentAspectClass, methodName);
    // pointcut.getMethodsMap().forEach((jpMembers, jpClass) => {
    //     const metadata = MetadataInstanceManager.getMetadata(jpClass, AOPClassMetadata);
    //     jpMembers.forEach(methodName => {
    //         metadata.append(methodName, advice, [AspectClass]);
    //     });
    // });
}
