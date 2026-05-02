import { GlobalMetadata } from '../metadata/GlobalMetadata';
import type { Instance } from '../types/Instance';
import type { InstantiationAwareProcessor, PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';
import type { Newable } from '../types/Newable';
import type { ApplicationContext } from './ApplicationContext';
import { lazy, recreateWhen } from '@vgerbot/lazily';
import { when } from '@vgerbot/lazily';

export class InstantiationAwareProcessorManager {
    private instAwareProcessorClasses: Set<Newable<PartialInstAwareProcessor>> = new Set();
    private readonly instAwareProcessorInstances: Array<PartialInstAwareProcessor> = lazy(() => {
        const globalInstAwareProcessorClasses = GlobalMetadata.getReader().getInstAwareProcessorClasses();
        const instAwareProcessorClasses = globalInstAwareProcessorClasses.concat(Array.from(this.instAwareProcessorClasses));
        return instAwareProcessorClasses.map(it => this.container.getInstance<PartialInstAwareProcessor, void>(it));
    });

    constructor(private readonly container: ApplicationContext) {
        recreateWhen(
            this.instAwareProcessorInstances,
            when(t =>
                t.or(
                    t.changed(() => this.instAwareProcessorClasses.size),
                    t.changed(() => GlobalMetadata.getReader().getInstAwareProcessorClasses().length)
                )
            )
        );
    }
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
                if (result) {
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
