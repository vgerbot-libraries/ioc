import { GlobalMetadata } from '../metadata/GlobalMetadata';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';
import { Newable } from '../types/Newable';

export function Bind(aliasName: string | symbol): ClassDecorator {
    return <TFunction extends Function>(target: TFunction) => {
        const metadata = MetadataInstanceManager.getMetadata(target as unknown as Newable<unknown>, ClassMetadata);
        GlobalMetadata.getInstance().recordClassAlias(aliasName, metadata);
    };
}
