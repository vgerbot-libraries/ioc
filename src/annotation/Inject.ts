import { Newable } from '../foundation/Newable';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { Identifier } from '../foundation/Identifier';
import { MetadataFactory } from '../metadata/MetadataFactory';

export type ConstructorParameterDecorator<T> = (target: Newable<T>, key: undefined, index: number) => void;

export function Inject<T>(constr: Identifier<T>) {
    return function (target: any, propertyKey: string | symbol, parameterIndex?: number) {
        if (typeof target === 'function' && typeof parameterIndex === 'number') {
            const targetConstr = target as Newable<T>;
            const classMetadata = MetadataFactory.getMetadata(targetConstr, ClassMetadata);
            classMetadata.setConstructorParameterType(parameterIndex, constr);
        } else if (typeof target === 'object' && propertyKey !== undefined) {
            const metadata = MetadataFactory.getMetadata(target.constructor, ClassMetadata);
            metadata.recordPropertyType(propertyKey, constr);
        }
    };
}
