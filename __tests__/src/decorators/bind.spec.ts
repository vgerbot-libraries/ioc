import { ApplicationContext, Bind, Inject } from '../../../src';

describe('@Bind', () => {
    it('should set alias for a component', () => {
        const SERVICE_ALIAS_IDENTIFIER = 'alias-name-of-service-a';
        @Bind(SERVICE_ALIAS_IDENTIFIER)
        class ServiceA {}
        class ServiceB {
            @Inject()
            public serviceA0!: ServiceA;
            @Inject(SERVICE_ALIAS_IDENTIFIER)
            public serviceA1!: ServiceA;
        }
        const ctx = new ApplicationContext();
        const serviceB = ctx.getInstance(ServiceB);
        console.log(serviceB.serviceA0);
        console.log(serviceB.serviceA1);
        expect(serviceB.serviceA0).toBe(serviceB.serviceA1);
    });
});
