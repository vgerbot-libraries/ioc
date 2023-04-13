import { Newable } from '../types/Newable';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { Identifier } from '../types/Identifier';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';
import { isNotDefined } from '../common/isNotDefined';

export function Inject<T>(constr?: Identifier<T>) {
    return function <Target>(target: Target, propertyKey: string | symbol, parameterIndex?: number) {
        if (typeof target === 'function' && typeof parameterIndex === 'number') {
            // constructor parameter
            const targetConstr = target as Newable<T>;
            if (isNotDefined(constr)) {
                constr = Reflect.getMetadata('design:paramtypes', target, propertyKey)[parameterIndex];
            }
            if (isNotDefined(constr)) {
                throw new Error('Type not recognized, injection cannot be performed');
            }
            const classMetadata = MetadataInstanceManager.getMetadata(targetConstr, ClassMetadata);
            classMetadata.setConstructorParameterType(parameterIndex, constr);
        } else if (typeof target === 'object' && target !== null && propertyKey !== undefined) {
            // property
            if (isNotDefined(constr)) {
                constr = Reflect.getMetadata('design:type', target, propertyKey);
            }
            if (isNotDefined(constr)) {
                throw new Error('Type not recognized, injection cannot be performed');
            }
            const metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
            metadata.recordPropertyType(propertyKey, constr);
        }
    };
}
