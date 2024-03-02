import { ApplicationContext, Factory } from '../../src';
import { PartialInstAwareProcessor } from '../../src';
import { Newable } from '../../src/types/Newable';

describe('InstantiationAwareProcessor', () => {
    describe('beforeInstantiation', () => {
        it('should the beforeInstantiation method be called before creating an instance', () => {
            class Service {
                hello() {
                    console.log('hello');
                }
            }
            const app = new ApplicationContext();
            const fn = jest.fn();
            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    beforeInstantiation<T>(constructor: Newable<T>, args: unknown[]): T | undefined | void {
                        fn();
                    }
                }
            );
            const service = app.getInstance(Service);
            service.hello();
            expect(fn).toBeCalled();
        });

        // eslint-disable-next-line max-len
        it('should the instance obtained by ApplicationContext be replaced by the instance returned by beforeInstantiation', () => {
            class Service {
                // PASS
            }
            const app = new ApplicationContext();
            const service0 = new Service();
            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    beforeInstantiation<T>(constructor: Newable<T>, args: unknown[]): T | undefined | void {
                        return service0 as T;
                    }
                }
            );
            const service = app.getInstance(Service);
            expect(service).toStrictEqual(service0);
        });
        it('should execute until the instance is returned if there are multiple beforeInstantiation', () => {
            const fn0 = jest.fn();
            const fn1 = jest.fn();
            const fn2 = jest.fn();

            const app = new ApplicationContext();

            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    beforeInstantiation<T>(constructor: Newable<T>, args: unknown[]): T | undefined | void {
                        fn0();
                    }
                }
            );
            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    beforeInstantiation<T>(constructor: Newable<T>, args: unknown[]): T | undefined | void {
                        fn1();
                        return new constructor(...args);
                    }
                }
            );
            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    beforeInstantiation<T>(constructor: Newable<T>, args: unknown[]): T | undefined | void {
                        fn2();
                    }
                }
            );
            class Service {
                // PASS
            }

            app.getInstance(Service);
            expect(fn0).toBeCalled();
            expect(fn1).toBeCalled();
            expect(fn2).not.toBeCalled();
        });
    });
    describe('afterInstantiation', () => {
        it('should afterInstantiation receive the correct parameter', () => {
            class Service {
                // PASS
            }
            const app = new ApplicationContext();
            const fn = jest.fn();
            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    afterInstantiation<T>(instance: T) {
                        fn(instance);
                        return instance;
                    }
                }
            );
            const service = app.getInstance(Service);
            expect(fn).toBeCalledWith(service);
        });

        // eslint-disable-next-line max-len
        it('should the instance obtained by ApplicationContext be replaced by the instance returned by afterInstantiation', () => {
            class Service {
                // PASS
            }
            const app = new ApplicationContext();
            const fn = jest.fn();
            const fn1 = jest.fn();
            let result;
            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    afterInstantiation<T>(instance: T) {
                        result = new Proxy(instance as object, {}) as T;
                        fn(instance);
                        fn1(result);
                        return result;
                    }
                }
            );
            const service = app.getInstance(Service);
            expect(fn).toBeCalled();
            expect(fn1).toBeCalled();
            expect(service).toBe(result);
        });
        it('multiple beforeInstantiation methods should be called', () => {
            class Service {
                // PASS
            }
            const app = new ApplicationContext();
            const fn = jest.fn();
            const fn1 = jest.fn();
            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    afterInstantiation<T>(instance: T) {
                        fn(instance);
                        return instance;
                    }
                }
            );
            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    afterInstantiation<T>(instance: T) {
                        fn1(instance);
                        return instance;
                    }
                }
            );
            const service = app.getInstance(Service);
            expect(fn).toBeCalledWith(service);
            expect(fn1).toBeCalledWith(service);
        });
        it('should replace instances generated from provider', () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class FertilizerProducer {
                @Factory('urea')
                produceUrea() {
                    return 'A pound of urea';
                }
                @Factory('potassium phosphate')
                producePotassiumPhosphate() {
                    return 'A pound of potassium phosphate';
                }
            }

            const app = new ApplicationContext();

            app.registerInstAwareProcessor(
                class implements PartialInstAwareProcessor {
                    afterInstantiation<T>(instance: T): T {
                        if (typeof instance === 'string') {
                            return instance.replace('A pound of', 'Two pounds of') as T;
                        }
                        return instance;
                    }
                }
            );

            const urea = app.getInstance<string, void>('urea');
            const potassiumPhosphate = app.getInstance('potassium phosphate');

            expect(urea).toBe('Two pounds of urea');
            expect(potassiumPhosphate).toBe('Two pounds of potassium phosphate');
        });
    });
    describe('registerBeforeInstantiationProcessor', () => {
        it('should the processor be called before creating an instance', () => {
            class Service {
                hello() {
                    console.log('hello');
                }
            }
            const app = new ApplicationContext();
            const fn = jest.fn();
            app.registerBeforeInstantiationProcessor(fn);
            app.getInstance(Service);
            expect(fn).toBeCalledWith(Service, []);
            app.getInstance(Service);
            expect(fn).toBeCalledTimes(1);
        });
    });
    describe('registerAfterInstantiationProcessor', () => {
        it('should the processor be called after creating an instance', () => {
            class Service {
                hello() {
                    console.log('hello');
                }
            }
            const app = new ApplicationContext();
            const fn = jest.fn();
            app.registerAfterInstantiationProcessor(fn);
            const instance = app.getInstance(Service);
            expect(fn).toBeCalledWith(instance);
        });
    });
});
