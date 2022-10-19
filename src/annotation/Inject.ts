import { PropertyMetadata } from '../metadata/PropertyMetadata';
import { Constructor } from '../foundation/Constructor';

export function Inject<T>(constr: Constructor<T>): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        const metadata = PropertyMetadata.record(target);
        metadata.recordPropertyConstructor(propertyKey, constr);
    };
}
