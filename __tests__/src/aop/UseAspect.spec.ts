import { ApplicationContext } from '../../../src';
import { Aspect, JoinPoint } from '../../../src/aop/Aspect';
import { UseAspects } from '../../../src/aop/decorators/UseAspects';
import { Advice } from '../../../src/aop/Advice';

describe('@UseAspect', () => {
    it('should aspect work with before advice', () => {
        const appCtx = new ApplicationContext();

        const callOrder: string[] = [];
        const testMethod = jest.fn().mockImplementation(() => callOrder.push('testMethod'));
        const testAspectMethod = jest.fn().mockImplementation(() => callOrder.push('testAspectMethod'));

        class TestAspect implements Aspect {
            execute(ctx: JoinPoint) {
                testAspectMethod();
            }
        }

        class Service {
            @UseAspects(Advice.Before, [TestAspect])
            testMethod() {
                testMethod();
            }
        }
        appCtx.getInstance(Service).testMethod();

        expect(testMethod).toBeCalled();
        expect(testAspectMethod).toBeCalled();
        expect(callOrder).toEqual(['testAspectMethod', 'testMethod']);
    });
    it('should aspect work with after advice', () => {
        const appCtx = new ApplicationContext();

        const callOrder: string[] = [];
        const testMethod = jest.fn().mockImplementation(() => callOrder.push('testMethod'));
        const testAspectMethod = jest.fn().mockImplementation(() => callOrder.push('testAspectMethod'));

        class TestAspect {
            execute() {
                testAspectMethod();
            }
        }

        class Service {
            @UseAspects(Advice.After, [TestAspect])
            testMethod() {
                testMethod();
            }
        }
        appCtx.getInstance(Service).testMethod();

        expect(testMethod).toBeCalled();
        expect(testAspectMethod).toBeCalled();
        expect(callOrder).toEqual(['testAspectMethod', 'testMethod']);
    });
});
