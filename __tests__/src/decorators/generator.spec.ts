import { ApplicationContext } from '../../../src';
import { Generate } from '../../../src/decorators/Generate';

describe('@Generate decorator', () => {
    it('should generate property using the provided generator function', () => {
        const mockRandomNumber = Math.random();
        const mockGenerator = jest.fn().mockReturnValue(mockRandomNumber);
        class Test {
            @Generate(mockGenerator)
            public random!: number;
        }

        const context = new ApplicationContext();
        const instance = context.getInstance(Test);
        expect(mockGenerator).not.toBeCalled();
        expect(instance.random).toBe(mockRandomNumber);
        expect(mockGenerator).toBeCalledWith(context);
    });
    it('should generator function invoke only once', () => {
        const mockGenerator = jest.fn().mockReturnValue(Math.random());
        class Test {
            @Generate(mockGenerator)
            public random!: number;
        }
        const noop = (num: unknown) => num;
        const context = new ApplicationContext();
        const instance = context.getInstance(Test);
        noop(instance.random);
        noop(instance.random);

        expect(mockGenerator).toBeCalledTimes(1);
    });
});
