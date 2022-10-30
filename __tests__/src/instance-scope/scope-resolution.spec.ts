import { ApplicationContext, InstanceScope, Scope } from '../../../src';

describe('InstanceScope', () => {
    describe('SINGLETON', () => {
        @Scope(InstanceScope.SINGLETON)
        class Service {}
        it('should only be created once', () => {
            const context = new ApplicationContext({});
            const service1 = context.getInstance(Service);
            const service2 = context.getInstance(Service);
            expect(service1 === service2).toBeTruthy();
        });
    });
    describe('GLOBAL_SHARED_SINGLETON', () => {
        @Scope(InstanceScope.GLOBAL_SHARED_SINGLETON)
        class Service {}
        it('should only be created once and shared in different contexts', () => {
            const context1 = new ApplicationContext();
            const context2 = new ApplicationContext();
            const service1 = context1.getInstance(Service);
            const service2 = context2.getInstance(Service);

            expect(service1 === service2).toBeTruthy();
        });
    });
    describe('TRANSIENT', () => {
        @Scope(InstanceScope.TRANSIENT)
        class Service {}
        it('should create new instance each time it is requested', () => {
            const context = new ApplicationContext();
            const service1 = context.getInstance(Service);
            const service2 = context.getInstance(Service);

            expect(service1 === service2).toBeFalsy();
        });
    });
});
