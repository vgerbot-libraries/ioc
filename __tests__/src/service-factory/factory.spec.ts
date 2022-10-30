import { ApplicationContext, Inject } from '../../../src';

describe('ServiceFactory', () => {
    it('should be able to inject value created by factory', () => {
        const context = new ApplicationContext();
        const FACTORY_IDENTIFIER = '';
        const VALUE = {};
        context.bindFactory(FACTORY_IDENTIFIER, () => {
            return () => VALUE;
        });

        class Service {
            @Inject(FACTORY_IDENTIFIER)
            public str!: object;
        }

        const service = context.getInstance(Service);

        expect(service.str).toStrictEqual(VALUE);
    });
});
