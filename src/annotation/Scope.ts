import { InstanceScope } from '../foundation/InstanceScope';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { MetadataFactory } from '../metadata/MetadataFactory';
import { Newable } from '../types/Newable';

export function Scope(scope: InstanceScope | string): ClassDecorator {
    return <TFunction extends Function>(target: TFunction) => {
        const metadata = MetadataFactory.getMetadata(target as unknown as Newable<unknown>, ClassMetadata);
        metadata.setScope(scope);
    };
}
