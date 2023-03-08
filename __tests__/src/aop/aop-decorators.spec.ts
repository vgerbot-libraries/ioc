import { Before } from '../../../src/aop/decorators/Before';
import { Pointcut } from '../../../src/aop/Pointcut';
import { JoinPoint } from '../../../src/aop/Aspect';
import { ApplicationContext } from '../../../src';
import { After } from '../../../src/aop/decorators/After';
import { Thrown } from '../../../src/aop/decorators/Thrown';
import { Finally } from '../../../src/aop/decorators/Finally';

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

            // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
            // @ts-ignore
            class BeforeAspect {
                @Before(Pointcut.of(Test, 'testMethod'))
                testAspectMethod(joinPoint: JoinPoint) {
                    testAspectMethod(joinPoint.functionParams[0]);
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

            // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
            // @ts-ignore
            class BeforeAspect {
                @After(Pointcut.of(Test, 'testMethod'))
                testAspectMethod(joinPoint: JoinPoint) {
                    testAspectMethod(joinPoint.functionParams[0]);
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

            // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
            // @ts-ignore
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

            // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
            // @ts-ignore
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
        // eslint-disable-next-line max-len
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
            // @ts-ignore
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
});
