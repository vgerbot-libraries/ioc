import { ApplicationContext, Inject, PreInject, PostInject, PreDestroy } from '../../src';

describe('Lifecycle', () => {
    describe('PreInject', () => {
        it('Should methods marked with this lifecycle be called before injection', () => {
            const testFn = jest.fn();
            const testService2Fn = jest.fn();
            class Service2 {
                constructor() {
                    testService2Fn();
                }
            }
            class Service {
                @Inject()
                service2!: Service2;

                @PreInject()
                beforeInjection() {
                    expect(this.service2).toBeUndefined();
                    expect(testService2Fn).not.toHaveBeenCalled();
                    testFn(this.service2);
                }
            }
            const ctx = new ApplicationContext();
            ctx.getInstance(Service);

            expect(testFn).toHaveBeenCalledTimes(1);
            expect(testFn).toHaveBeenCalledWith(undefined);
        });
    });
    describe('PostInject', () => {
        it('Should methods marked with this lifecycle be called after injection', () => {
            const testFn = jest.fn();
            const testService2Fn = jest.fn();
            class Service2 {
                constructor() {
                    testService2Fn();
                }
            }
            class Service {
                @Inject()
                service2!: Service2;

                @PostInject()
                afterInjection() {
                    expect(this.service2).toBeInstanceOf(Service2);
                    expect(testService2Fn).toHaveBeenCalled();
                    testFn(this.service2);
                }
            }
            const ctx = new ApplicationContext();
            const service = ctx.getInstance(Service);

            expect(testFn).toHaveBeenCalledTimes(1);
            expect(service.service2).toBeDefined();
            expect(testFn).toHaveBeenCalledWith(service.service2);
        });
    });
    describe('PreDestroy', () => {
        it('Should methods marked with this lifecycle be called before destruction', () => {
            const destroyFn = jest.fn();
            class Service {
                @PreDestroy()
                doDestroy() {
                    destroyFn();
                }
            }
            const ctx = new ApplicationContext();
            ctx.getInstance(Service);
            expect(destroyFn).not.toBeCalled();
            ctx.destroy();
            expect(destroyFn).toBeCalled();
        });
        it('Should destroy instances in the desired order', () => {
            const destroyFn0 = jest.fn();
            const destroyFn1 = jest.fn();

            class Service0 {
                @PreDestroy()
                doDestroy() {
                    destroyFn0();
                }
            }
            class Service1 {
                @Inject()
                private service0!: Service0;
                @PostInject()
                init() {
                    // noinspection BadExpressionStatementJS
                    this.service0;
                }
                @PreDestroy()
                doDestroy() {
                    destroyFn1();
                }
            }
            const ctx = new ApplicationContext();
            ctx.getInstance(Service1);
            ctx.destroy();

            expect(destroyFn0).toBeCalledTimes(1);
            expect(destroyFn1).toBeCalledTimes(1);

            const order0 = destroyFn0.mock.invocationCallOrder[0];
            const order1 = destroyFn1.mock.invocationCallOrder[0];

            expect(order1).toBeLessThan(order0);
        });
    });
});
