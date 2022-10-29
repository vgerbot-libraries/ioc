import { GlobalMetadata } from '../metadata/GlobalMetadata';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { MetadataFactory } from '../metadata/MetadataFactory';

export function Bind(aliasName: string | symbol): ClassDecorator {
    return <TFunction extends Function>(target: TFunction) => {
        const metadata = MetadataFactory.getMetadata(target, ClassMetadata);
        GlobalMetadata.getInstance().recordClassAlias(aliasName, metadata);
    };
}
