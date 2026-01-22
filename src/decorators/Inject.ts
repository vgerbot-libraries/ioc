import { isNotDefined } from '../common/isNotDefined';
import { InjectionType } from '../foundation/InjectionType';
import { GlobalMetadata } from '../metadata';
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
            if (typeof identifier === 'function') {
                injectClass = identifier;
            } else {
                injectClass = Reflect.getMetadata('design:type', target, propertyKey);
            }
            const metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
            if (isNotDefined(injectClass)) {
                if (identifier && typeof identifier !== 'function') {
                    const factoryDef = GlobalMetadata.getInstance().reader().getComponentFactory(identifier);
                    if (factoryDef) {
                        metadata.recordPropertyType(propertyKey, InjectionType.ofIdentifier(identifier));
                        return;
                    }
                }
                throw new Error('Type not recognized, injection cannot be performed');
            } else {
                metadata.recordPropertyType(propertyKey, InjectionType.of(injectClass, identifier));
            }
        }
    };
}
