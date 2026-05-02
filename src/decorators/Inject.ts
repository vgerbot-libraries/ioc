import { isNotDefined } from '../common/isNotDefined';
import { InjectionType } from '../foundation/InjectionType';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';
import type { Identifier } from '../types/Identifier';
import type { Newable } from '../types/Newable';

export function Inject<T>(identifier?: Identifier<T>) {
    return <Target>(target: Target, propertyKey: string | symbol, parameterIndex?: number) => {
        let injectClass: Newable<unknown> | undefined;
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
            let injectClass: Newable<unknown> | undefined;
            const metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
            if (typeof identifier === 'function') {
                injectClass = identifier;
            } else if (identifier && typeof identifier !== 'function') {
                metadata.recordPropertyType(propertyKey, InjectionType.ofIdentifier(identifier));
                return;
            } else {
                injectClass = Reflect.getMetadata('design:type', target, propertyKey);
            }
            if (isNotDefined(injectClass)) {
                throw new Error('Type not recognized, injection cannot be performed');
            } else {
                metadata.recordPropertyType(propertyKey, InjectionType.of(injectClass, identifier));
            }
        }
    };
}
