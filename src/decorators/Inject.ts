import { Newable } from '../types/Newable';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { Identifier } from '../types/Identifier';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';
import { isNotDefined } from '../common/isNotDefined';
import { InjectionType } from '../foundation/InjectionType';

export function Inject<T>(identifier?: Identifier<T>) {
    return function <Target>(target: Target, propertyKey: string | symbol, parameterIndex?: number) {
        let injectClass: Newable<unknown> | undefined = undefined;
        if (typeof target === 'function' && typeof parameterIndex === 'number') {
            // constructor parameter
            const targetConstr = target as Newable<T>;
            if (typeof identifier === 'function') {
                injectClass = identifier;
            } else {
                injectClass = Reflect.getMetadata('design:paramtypes', target, propertyKey)[parameterIndex];
            }
            if (isNotDefined(injectClass)) {
                throw new Error('Type not recognized, injection cannot be performed');
            }
            const classMetadata = MetadataInstanceManager.getMetadata(targetConstr, ClassMetadata);
            classMetadata.setConstructorParameterType(parameterIndex, InjectionType.of(injectClass, identifier));
        } else if (typeof target === 'object' && target !== null && propertyKey !== undefined) {
            let injectClass: Newable<unknown> | undefined = undefined;
            if (typeof identifier === 'function') {
                injectClass = identifier;
            } else {
                injectClass = Reflect.getMetadata('design:type', target, propertyKey);
            }
            if (isNotDefined(injectClass)) {
                throw new Error('Type not recognized, injection cannot be performed');
            }
            const metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
            metadata.recordPropertyType(propertyKey, InjectionType.of(injectClass, identifier));
        }
    };
}
