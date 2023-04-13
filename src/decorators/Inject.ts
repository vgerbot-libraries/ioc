import { Newable } from '../types/Newable';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { Identifier } from '../types/Identifier';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';

export function Inject<T>(constr: Identifier<T>) {
    return function <Target>(target: Target, propertyKey: string | symbol, parameterIndex?: number) {
        if (typeof target === 'function' && typeof parameterIndex === 'number') {
            const targetConstr = target as Newable<T>;
            const classMetadata = MetadataInstanceManager.getMetadata(targetConstr, ClassMetadata);
            classMetadata.setConstructorParameterType(parameterIndex, constr);
        } else if (typeof target === 'object' && target !== null && propertyKey !== undefined) {
            const metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
            metadata.recordPropertyType(propertyKey, constr);
        }
    };
}
