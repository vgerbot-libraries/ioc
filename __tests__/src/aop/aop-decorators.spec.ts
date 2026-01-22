import { ApplicationContext } from '../../../src';
import type { JoinPoint, ProceedingJoinPoint } from '../../../src/aop/Aspect';
import { After } from '../../../src/aop/decorators/After';
import { Around } from '../../../src/aop/decorators/Around';
import { Before } from '../../../src/aop/decorators/Before';
import { Finally } from '../../../src/aop/decorators/Finally';
import { Thrown } from '../../../src/aop/decorators/Thrown';
import { Pointcut } from '../../../src/aop/Pointcut';

describe('AOP decorators', () => {
    describe('@Before', () => {
        it('should execute the target aspect before the pointcut method', () => {
            const callOrder: string[] = [];
            const testMethod = jest.fn().mockImplementation(() => callOrder.push('testMethod'));
            const testAspectMethod = jest.fn().mockImplementation(() => callOrder.push('testAspectMethod'));
            class Test {
                testMethod(input: string) {
                    testMethod(input);
                }
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error

            class BeforeAspect {
                @Before(Pointcut.of(Test, 'testMethod'))
                testAspectMethod(joinPoint: JoinPoint) {
                    testAspectMethod(joinPoint.arguments[0]);
                }
            }
            const app = new ApplicationContext();
            const test = app.getInstance(Test);
            const input = 'hello world';
            test.testMethod(input);
            expect(testMethod).toBeCalledWith(input);
            expect(testAspectMethod).toBeCalledWith(input);
            expect(callOrder).toEqual(['testAspectMethod', 'testMethod']);
        });
    });
    describe('@After', () => {
        it('should execute the decorated aspect method invoke after the target pointcut method', () => {
            const callOrder: string[] = [];
            const testMethod = jest.fn().mockImplementation(() => callOrder.push('testMethod'));
            const testAspectMethod = jest.fn().mockImplementation(() => callOrder.push('testAspectMethod'));
            class Test {
                testMethod(input: string) {
                    testMethod(input);
                }
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            class BeforeAspect {
                @After(Pointcut.of(Test, 'testMethod'))
                testAspectMethod(joinPoint: JoinPoint) {
                    testAspectMethod(joinPoint.arguments[0]);
                }
            }
            const app = new ApplicationContext();
            const test = app.getInstance(Test);
            const input = 'hello world';
            test.testMethod(input);
            expect(testMethod).toBeCalledWith(input);
            expect(testAspectMethod).toBeCalledWith(input);
            expect(callOrder).toEqual(['testMethod', 'testAspectMethod']);
        });
    });
    describe('@Thrown', () => {
        it('should execute the decorated aspect method after the target method throws an error', () => {
            const testAspectMethod = jest.fn();
            class Test {
                testMethod(input: string) {
                    throw new Error(input);
                }
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            class BeforeAspect {
                @Thrown(Pointcut.of(Test, 'testMethod'))
                testAspectMethod(joinPoint: JoinPoint) {
                    expect(joinPoint.error).not.toBeUndefined();
                    testAspectMethod(joinPoint.error?.message);
                }
            }
            const app = new ApplicationContext();
            const test = app.getInstance(Test);
            const input = 'hello world';
            expect(() => test.testMethod(input)).not.toThrowError();
            expect(testAspectMethod).toBeCalledWith(input);
        });
        it('should forward the error messages by the decorated aspect method after the target method throws an error', () => {
            const testAspectMethod = jest.fn();
            class Test {
                testMethod(input: string) {
                    throw new Error(input);
                }
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            class BeforeAspect {
                @Thrown(Pointcut.of(Test, 'testMethod'))
                testAspectMethod(joinPoint: JoinPoint) {
                    expect(joinPoint.error).not.toBeUndefined();
                    testAspectMethod(joinPoint.error?.message);
                    throw joinPoint.error;
                }
            }
            const app = new ApplicationContext();
            const test = app.getInstance(Test);
            const input = 'hello world';
            expect(() => test.testMethod(input)).toThrowError(input);
            expect(testAspectMethod).toBeCalledWith(input);
        });
    });
    describe('@Finally', () => {
        it('should execute the decorated aspect method after the target pointcut method regardless of whether it throws an error', () => {
            class Test {
                testMethod() {
                    //
                }
            }
            class Test2 {
                testMethod() {
                    throw new Error('Test error');
                }
            }
            const afterTest1 = jest.fn();
            const afterTest2 = jest.fn();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error

            class TestAspect {
                @Finally(Pointcut.of(Test, 'testMethod'))
                afterTest1() {
                    afterTest1();
                }
                @Finally(Pointcut.of(Test2, 'testMethod'))
                afterTest2() {
                    afterTest2();
                }
            }
            const app = new ApplicationContext();
            const test = app.getInstance(Test);
            test.testMethod();
            expect(afterTest1).toBeCalled();
            const test2 = app.getInstance(Test2);
            expect(() => test2.testMethod()).toThrowError();
            expect(afterTest2).toBeCalled();
        });
    });
    describe('@Around', () => {
        it('should execute the method which annotated with @Around annotation', () => {
            const testMethod = jest.fn();
            const testAspectMethod = jest.fn();
            class Test {
                testMethod() {
                    testMethod();
                }
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error

            class TestAspect {
                @Around(Pointcut.of(Test, 'testMethod'))
                around(joinPoint: ProceedingJoinPoint) {
                    testAspectMethod();
                    joinPoint.proceed();
                }
            }
            const app = new ApplicationContext();
            const test = app.getInstance(Test);
            test.testMethod();
            expect(testMethod).toBeCalled();
            expect(testAspectMethod).toBeCalled();
        });
        it('should not execute the testMethod if not calling the proceed function', () => {
            const testMethod = jest.fn();
            const testAspectMethod = jest.fn();
            class Test {
                testMethod() {
                    testMethod();
                }
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error

            class TestAspect {
                @Around(Pointcut.of(Test, 'testMethod'))
                around(_joinPoint: ProceedingJoinPoint) {
                    testAspectMethod();
                }
            }
            const app = new ApplicationContext();
            const test = app.getInstance(Test);
            test.testMethod();
            expect(testMethod).not.toBeCalled();
            expect(testAspectMethod).toBeCalled();
        });
        it('should the aspect method annotated with @Before and @After be called when the proceed method is not called', () => {
            const testMethod = jest.fn();
            const testAspectMethod = jest.fn();
            const testAspectBeforeMethod = jest.fn();
            const testAspectAfterMethod = jest.fn();
            class Test {
                testMethod() {
                    testMethod();
                }
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error

            class TestAspect {
                @Before(Pointcut.of(Test, 'testMethod'))
                before() {
                    testAspectBeforeMethod();
                }
                @After(Pointcut.of(Test, 'testMethod'))
                after() {
                    testAspectAfterMethod();
                }
                @Around(Pointcut.of(Test, 'testMethod'))
                around(_joinPoint: ProceedingJoinPoint) {
                    testAspectMethod();
                }
            }
            const app = new ApplicationContext();
            const test = app.getInstance(Test);
            test.testMethod();
            expect(testMethod).not.toBeCalled();
            expect(testAspectMethod).toBeCalled();
            expect(testAspectBeforeMethod).toBeCalled();
            expect(testAspectAfterMethod).toBeCalled();
        });
    });
});
