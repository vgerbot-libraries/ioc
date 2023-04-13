import { ClassMetadata } from '../metadata/ClassMetadata';
import { GlobalMetadata } from '../metadata/GlobalMetadata';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';
import { ExpressionType } from '../types/EvaluateOptions';
import { isNodeJs } from '../common/isNodeJs';

export function Value<A = unknown>(expression: string, type: ExpressionType | string, externalArgs?: A): PropertyDecorator {
    switch (type) {
        case ExpressionType.ENV:
        case ExpressionType.ARGV:
            if (!isNodeJs) {
                throw new Error(`The "${type}" evaluator only supports nodejs environment!`);
            }
    }
    return (target: Object, propertyKey: string | symbol) => {
        const metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
        const value_symbol = Symbol('');
        metadata.recordPropertyType(propertyKey, value_symbol);
        GlobalMetadata.getInstance().recordFactory(value_symbol, (container, owner) => {
            return () =>
                container.evaluate<string, typeof owner, A>(expression as string, {
                    owner,
                    type,
                    externalArgs
                });
        });
    };
}
