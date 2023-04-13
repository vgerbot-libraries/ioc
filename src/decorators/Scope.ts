import { InstanceScope } from '../foundation/InstanceScope';
import { ClassMetadata } from '../metadata/ClassMetadata';
import { MetadataInstanceManager } from '../metadata/MetadataInstanceManager';
import { Newable } from '../types/Newable';

export function Scope(scope: InstanceScope | string): ClassDecorator {
    return <TFunction extends Function>(target: TFunction) => {
        const metadata = MetadataInstanceManager.getMetadata(target as unknown as Newable<unknown>, ClassMetadata);
        metadata.setScope(scope);
    };
}
