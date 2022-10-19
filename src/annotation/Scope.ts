import { InstanceScope } from '../guards/InstanceScope';
import { ClassMetadata } from '../metadata/ClassMetadata';

export function Scope(scope: InstanceScope): ClassDecorator {
    return <TFunction extends Function>(target: TFunction) => {
        const metadata = ClassMetadata.record(target);
        metadata.setScope(scope);
    };
}
