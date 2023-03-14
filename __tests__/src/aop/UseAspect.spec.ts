import { ApplicationContext } from '../../../src';
import { Aspect, JoinPoint } from '../../../src/aop/Aspect';
import { UseAspects } from '../../../src/aop/decorators/UseAspects';
import { Advice } from '../../../src/aop/Advice';

describe('@UseAspect', () => {
    it('should return a method decorator', () => {
        const decorator = UseAspects(Advice.Around, []);

        expect(typeof decorator).toBe('function');
    });
    describe('Advice.Around', () => {
        it('should apply Around advice correctly', () => {
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
    });
    describe('Advice.Before', () => {
        it('should invoke the aspect before the method is called', () => {
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
    });
    describe('Advice.After', () => {
        it('should invoke the aspect after the method is called', () => {
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
            expect(callOrder).toEqual(['testMethod', 'testAspectMethod']);
        });
    });
    describe('Advice.AfterReturn', () => {
        it('should invoke the aspect after the method is called', () => {
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
                @UseAspects(Advice.AfterReturn, [TestAspect])
                testMethod() {
                    testMethod();
                }
            }
            appCtx.getInstance(Service).testMethod();

            expect(testMethod).toBeCalled();
            expect(testAspectMethod).toBeCalled();
            expect(callOrder).toEqual(['testMethod', 'testAspectMethod']);
        });
        it('should replace the returning value by the aspect', () => {
            const appCtx = new ApplicationContext();

            class TestAspect implements Aspect {
                execute(jp: JoinPoint) {
                    return jp.returnValue + '-aspect';
                }
            }

            class Service {
                @UseAspects(Advice.AfterReturn, [TestAspect])
                testMethod() {
                    return 'test';
                }
            }
            const returnValue = appCtx.getInstance(Service).testMethod();
            expect(returnValue).toBe('test-aspect');
        });
    });
    describe('Advice.Thrown', () => {
        it('should invoke the aspect when the method throws an exception', async () => {
            const testAspectMethod = jest.fn();
            class TestAspect implements Aspect {
                execute(jp: JoinPoint) {
                    testAspectMethod(jp.error);
                }
            }
            class TestClass {
                @UseAspects(Advice.Thrown, [TestAspect])
                testMethod() {
                    throw new Error();
                }
            }
            const testMethod = jest.spyOn(TestClass.prototype, 'testMethod');
            const appCtx = new ApplicationContext();

            expect(() => {
                appCtx.getInstance(TestClass).testMethod();
            }).not.toThrow();
            expect(testMethod).toBeCalled();
            expect(testMethod).toThrow();
            expect(testAspectMethod).toBeCalledWith(new Error());
        });
    });
});
