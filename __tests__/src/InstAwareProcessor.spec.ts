import { InstAwareProcessor } from '../../src/decorators/InstAwareProcessor';
import { InstAwareProcessorMetadata } from '../../src/metadata/InstAwareProcessorMetadata';
import { PartialInstAwareProcessor } from '../../src';

describe('@InstAwareProcessor', () => {
    it('should return a method decorator', () => {
        const decorator = InstAwareProcessor();
        expect(typeof decorator).toBe('function');
    });
    it('should register the decorated class', () => {
        const recordProcessorClassSpy = jest.spyOn(InstAwareProcessorMetadata.prototype, 'recordProcessorClass');
        @InstAwareProcessor()
        class TestClass implements PartialInstAwareProcessor {
            afterInstantiation<T extends Object>(instance: T): T {
                return instance;
            }
        }
        expect(recordProcessorClassSpy).toHaveBeenCalledWith(TestClass);
    });
});
