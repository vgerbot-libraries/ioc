import { GlobalMetadata } from '../metadata/GlobalMetadata';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { MetadataFactory } from '../metadata/MetadataFactory';
import { Newable } from '../types/Newable';

export function Bind(aliasName: string | symbol): ClassDecorator {
    return <TFunction extends Function>(target: TFunction) => {
        const metadata = MetadataFactory.getMetadata(target as unknown as Newable<unknown>, ClassMetadata);
        GlobalMetadata.getInstance().recordClassAlias(aliasName, metadata);
    };
}
