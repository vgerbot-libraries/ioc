import { ApplicationContext, Inject, PreInject, PostInject, PreDestroy } from '../../../src';

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
                @Inject(Service2)
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
                @Inject(Service2)
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
    });
});
