import { Metadata } from '../types/Metadata';
import { Newable } from '../types/Newable';
import { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';

const INST_AWARE_PROCESSOR_METADATA_KEY = 'ioc:instantiation-aware-processor';

export interface InstAwareProcessorMetadataReader {
    getInstAwareProcessorClasses(): Array<Newable<PartialInstAwareProcessor>>;
}

export class InstAwareProcessorMetadata implements Metadata<InstAwareProcessorMetadataReader, void> {
    static getReflectKey() {
        return INST_AWARE_PROCESSOR_METADATA_KEY;
    }
    private readonly processorClasses: Set<Newable<PartialInstAwareProcessor>> = new Set();
    init() {
        // PASS
    }
    recordProcessorClass(clazz: Newable<PartialInstAwareProcessor>) {
        this.processorClasses.add(clazz);
    }
    reader(): InstAwareProcessorMetadataReader {
        return {
            getInstAwareProcessorClasses: (): Array<Newable<PartialInstAwareProcessor>> => {
                return Array.from(this.processorClasses);
            }
        };
    }
}
