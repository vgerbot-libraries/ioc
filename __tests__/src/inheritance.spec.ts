import { ApplicationContext, Inject, PreDestroy } from '../../src';

describe('Inheritance', () => {
    it('should invoke methods marked with @PreDestroy() in parent class upon context destruction', () => {
        const fn = jest.fn();
        class BaseService {
            @PreDestroy()
            onDestroy() {
                fn(this);
            }
        }
        class ServiceA extends BaseService {}
        const ctx = new ApplicationContext();
        const baseService = ctx.getInstance(BaseService);
        const serviceA = ctx.getInstance(ServiceA);
        ctx.destroy();
        expect(fn).toBeCalledTimes(2);
        expect(fn).toHaveBeenCalledWith(serviceA);
        expect(fn).toHaveBeenCalledWith(baseService);
    });
    it('should invoke overridden methods in subclasses marked @PreDestroy()', () => {
        const fn = jest.fn();

        class ParentService {
            @PreDestroy()
            onDestroy() {
                fn('ParentService');
            }
        }

        class ChildService extends ParentService {
            @PreDestroy()
            onDestroy() {
                fn('ChildService');
            }
        }

        const ctx = new ApplicationContext();
        ctx.getInstance(ParentService);
        ctx.getInstance(ChildService);
        ctx.destroy();

        expect(fn).toHaveBeenNthCalledWith(1, 'ChildService');
    });
    it('Should Successfully Inject Properties Defined in Parent Class', () => {
        class Service {}

        class Parent {
            @Inject()
            service!: Service;
        }
        class Child extends Parent {}

        const ctx = new ApplicationContext();
        const child = ctx.getInstance(Child);
        const service = ctx.getInstance(Service);
        expect(child.service).toStrictEqual(service);
    });
});
