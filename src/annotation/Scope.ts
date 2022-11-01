import { InstanceScope } from '../foundation/InstanceScope';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { MetadataFactory } from '../metadata/MetadataFactory';

export function Scope(scope: InstanceScope | string): ClassDecorator {
    return <TFunction extends Function>(target: TFunction) => {
        const metadata = MetadataFactory.getMetadata(target, ClassMetadata);
        metadata.setScope(scope);
    };
}
