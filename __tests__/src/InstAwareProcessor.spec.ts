import { InstAwareProcessor } from '../../src/decorators/InstAwareProcessor';
import { PartialInstAwareProcessor } from '../../src';
import { GlobalMetadata } from '../../src/metadata/GlobalMetadata';

describe('@InstAwareProcessor', () => {
    it('should return a method decorator', () => {
        const decorator = InstAwareProcessor();
        expect(typeof decorator).toBe('function');
    });
    it('should register the decorated class', () => {
        const recordProcessorClassSpy = jest.spyOn(GlobalMetadata.prototype, 'recordProcessorClass');
        @InstAwareProcessor()
        class TestClass implements PartialInstAwareProcessor {
            afterInstantiation<T extends Object>(instance: T): T {
                return instance;
            }
        }
        expect(recordProcessorClassSpy).toHaveBeenCalledWith(TestClass);
    });
});
