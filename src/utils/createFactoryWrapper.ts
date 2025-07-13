import { Factory } from '../decorators';
import { FactoryIdentifier } from '../types/FactoryIdentifier';

export function createFactoryWrapper(produceIdentifier: FactoryIdentifier, produce: unknown, owner?: unknown) {
    class TheFactory {
        @Factory(produceIdentifier)
        produce() {
            return produce;
        }
        static preventTreeShaking() {
            return owner;
        }
    }
    return TheFactory.preventTreeShaking();
}