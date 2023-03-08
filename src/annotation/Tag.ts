import { Identifier } from '../types/Identifier';

type ArgumentType<T> = T extends (...args: infer A) => unknown ? A : never;

export function Tag(id: Identifier): ClassDecorator | PropertyDecorator | MethodDecorator {
    return function (...args: ArgumentType<ClassDecorator> | ArgumentType<PropertyDecorator> | ArgumentType<MethodDecorator>) {
        if (args.length === 1) {
            const [target] = args;
            tagClass(id, target);
        } else if (args.length === 2) {
            const [target, propertyKey] = args;
            tagPropertyKey(id, target, propertyKey);
        } else {
            const [target, propertyKey, descriptor] = args;
            tagMethod(id, target, propertyKey, descriptor);
        }
    };
}
function tagClass<TFunction extends Function>(id: Identifier, target: TFunction) {
    //
}

function tagPropertyKey(id: Identifier, target: Object, propertyKey: symbol | string) {
    //
}

function tagMethod(id: Identifier, target: Object, propertyKey: symbol | string, descriptor: TypedPropertyDescriptor<unknown>) {
    //
}
