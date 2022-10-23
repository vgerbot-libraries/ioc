import { ComponentClass } from '../foundation/ComponentClass';
import { GlobalMetadata } from '../metadata/GlobalMetadata';

export function Bind(symbol: string | symbol): ClassDecorator {
    return <TFunction extends Function>(target: TFunction) => {
        GlobalMetadata.getInstance().recordClassSymbol(symbol, target as unknown as ComponentClass);
    };
}
