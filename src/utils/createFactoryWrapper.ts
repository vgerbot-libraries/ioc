import { Factory } from '../decorators';
import { FactoryIdentifier } from '../types/FactoryIdentifier';

export function createFactoryWrapper<T>(produceIdentifier: FactoryIdentifier, produce: unknown, owner: T): T {
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