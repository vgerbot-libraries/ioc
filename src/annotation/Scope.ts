import { InstanceScope } from '../foundation/InstanceScope';
import { ClassMetadata } from '../metadata/ClassMetadata';

export function Scope(scope: InstanceScope): ClassDecorator {
    return <TFunction extends Function>(target: TFunction) => {
        const metadata = ClassMetadata.getMetadata(target);
        metadata.setScope(scope);
    };
}
