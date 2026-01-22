import { GlobalMetadata } from '../metadata/GlobalMetadata';
import type { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';
import type { Newable } from '../types/Newable';

export function InstAwareProcessor() {
    return <Cls extends Newable<PartialInstAwareProcessor>>(target: Cls) => {
        GlobalMetadata.getInstance().recordProcessorClass(target);
        return target;
    };
}
