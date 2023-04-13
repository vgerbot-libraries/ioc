import 'reflect-metadata';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';
import { ClassMetadata } from '../metadata/ClassMetadata';

export function Mark(key: string | symbol, value: unknown = true): Function {
    return function (
        ...args:
            | Parameters<ClassDecorator>
            | Parameters<MethodDecorator>
            | Parameters<PropertyDecorator>
            | Parameters<ParameterDecorator>
    ) {
        if (args.length === 1) {
            // class decorator
            const metadata = MetadataInstanceManager.getMetadata(args[0], ClassMetadata);
            metadata.marker().ctor(key, value);
        } else if (args.length === 2) {
            // property decorator
            const [prototype, propertyKey] = args;
            const metadata = MetadataInstanceManager.getMetadata(prototype.constructor, ClassMetadata);
            metadata.marker().member(propertyKey).mark(key, value);
        } else if (args.length === 3 && typeof args[2] === 'number') {
            // parameter decorator
            const [prototype, propertyKey, index] = args;
            const metadata = MetadataInstanceManager.getMetadata(prototype.constructor, ClassMetadata);
            metadata.marker().parameter(propertyKey, index).mark(key, value);
        } else {
            // method decorator
            const [prototype, propertyKey] = args;
            const metadata = MetadataInstanceManager.getMetadata(prototype.constructor, ClassMetadata);
            metadata.marker().member(propertyKey).mark(key, value);
        }
    };
}
