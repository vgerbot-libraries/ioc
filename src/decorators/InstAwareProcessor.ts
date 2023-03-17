import { Newable } from '../types/Newable';
import { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';
import { GlobalMetadata } from '../metadata/GlobalMetadata';

export function InstAwareProcessor() {
    return function <Cls extends Newable<PartialInstAwareProcessor>>(target: Cls) {
        GlobalMetadata.getInstance().recordProcessorClass(target);
        return target;
    };
}
