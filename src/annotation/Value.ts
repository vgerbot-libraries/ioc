import { ClassMetadata } from '../metadata/ClassMetadata';
import { GlobalMetadata } from '../metadata/GlobalMetadata';
import { MetadataFactory } from '../metadata/MetadataFactory';
import { ExpressionType } from '../types/EvaluateOptions';

export function Value(expression: string, type: ExpressionType | string): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        const metadata = MetadataFactory.getMetadata(target.constructor, ClassMetadata);
        const value_symbol = Symbol('');
        metadata.recordPropertyType(propertyKey, value_symbol);
        GlobalMetadata.getInstance().recordFactory(value_symbol, (container, owner) => {
            return () =>
                container.evaluate<string, typeof owner>(expression as string, {
                    owner,
                    type
                });
        });
    };
}
