import { ComponentClass } from '../foundation/ComponentClass';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { TypeSymbol } from '../foundation/TypeSymbol';

export type ConstructorParameterDecorator<TFunction extends ComponentClass> = (
    target: TFunction,
    key: undefined,
    index: number
) => void;

export function Inject<T>(constr: TypeSymbol<T>): PropertyDecorator | ConstructorParameterDecorator<ComponentClass<T>> {
    return function (target: Object, propertyKey?: string | symbol, parameterIndex?: number) {
        if (typeof target === 'function' && typeof parameterIndex === 'number') {
            const targetConstr = target as ComponentClass<T>;
            const classMetadata = ClassMetadata.getMetadata(targetConstr);
            classMetadata.setConstructorParameterType(parameterIndex, constr);
        } else if (typeof target === 'object' && propertyKey !== undefined) {
            const metadata = ClassMetadata.getMetadata(target.constructor);
            metadata.recordPropertyType(propertyKey, constr);
        }
    };
}
