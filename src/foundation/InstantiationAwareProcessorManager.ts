import { Newable } from '../types/Newable';
import { InstantiationAwareProcessor, PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';
import { lazyMember } from '@vgerbot/lazy';
import { ApplicationContext } from './ApplicationContext';
import { Instance } from '../types/Instance';
import { GlobalMetadata } from '../metadata/GlobalMetadata';

export class InstantiationAwareProcessorManager {
    private instAwareProcessorClasses: Set<Newable<PartialInstAwareProcessor>> = new Set();
    @lazyMember<InstantiationAwareProcessorManager, keyof InstantiationAwareProcessorManager, PartialInstAwareProcessor[]>({
        evaluate: instance => {
            const globalInstAwareProcessorClasses = GlobalMetadata.getInstance().reader().getInstAwareProcessorClasses();
            const instAwareProcessorClasses = globalInstAwareProcessorClasses.concat(
                Array.from(instance.instAwareProcessorClasses)
            );
            return instAwareProcessorClasses.map(it => instance.container.getInstance<PartialInstAwareProcessor, void>(it));
        },
        resetBy: [
            instance => instance.instAwareProcessorClasses.size,
            () => {
                const globalInstAwareProcessorClasses = GlobalMetadata.getInstance().reader().getInstAwareProcessorClasses();
                return globalInstAwareProcessorClasses.length;
            }
        ]
    })
    private instAwareProcessorInstances!: Array<PartialInstAwareProcessor>;

    constructor(private readonly container: ApplicationContext) {}
    appendInstAwareProcessorClass(instAwareProcessorClass: Newable<PartialInstAwareProcessor>) {
        this.instAwareProcessorClasses.add(instAwareProcessorClass);
    }
    appendInstAwareProcessorClasses(
        instAwareProcessorClasses: Set<Newable<PartialInstAwareProcessor>> | Array<Newable<PartialInstAwareProcessor>>
    ) {
        instAwareProcessorClasses.forEach(it => {
            this.instAwareProcessorClasses.add(it);
        });
    }
    beforeInstantiation<T>(componentClass: Newable<T>, args: unknown[]) {
        const instAwareProcessors = this.instAwareProcessorInstances;
        let instance: undefined | Instance<T>;
        instAwareProcessors.some(processor => {
            if (!processor.beforeInstantiation) {
                return false;
            }
            instance = processor.beforeInstantiation<T>(componentClass, args) as Instance<T>;
            return !!instance;
        });
        return instance;
    }
    afterInstantiation<T>(instance: Instance<T>) {
        return this.instAwareProcessorInstances.reduce((instance, processor) => {
            if (processor.afterInstantiation) {
                const result = processor.afterInstantiation(instance);
                if (!!result) {
                    return result as Instance<T>;
                }
            }
            return instance;
        }, instance);
    }
    isInstAwareProcessorClass(cls: Newable<unknown>) {
        const classes = this.getInstAwareProcessorClasses();
        return classes.indexOf(cls as Newable<InstantiationAwareProcessor>) > -1;
    }
    getInstAwareProcessorClasses() {
        const globalInstAwareProcessorClasses = GlobalMetadata.getInstance().reader().getInstAwareProcessorClasses();
        return globalInstAwareProcessorClasses.concat(Array.from(this.instAwareProcessorClasses));
    }
}
