import { PropertyMetadata } from '../metadata/PropertyMetadata';
import { ComponentClass } from '../foundation/ComponentClass';

export function Inject<T>(constr: ComponentClass<T>): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        const metadata = PropertyMetadata.getMetadata(target.constructor);
        metadata.recordPropertyConstructor(propertyKey, constr);
    };
}
