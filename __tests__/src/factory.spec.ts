import { ApplicationContext, Factory, Inject } from '../../src';

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
    // eslint-disable-next-line prettier/prettier
    it.only('should be able to inject value created by other service\'s member functions', () => {
        const context = new ApplicationContext();
        const FACTORY_IDENTIFIER = '';
        const VALUE = Symbol('value');

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class ProviderService {
            @Factory(FACTORY_IDENTIFIER)
            provider(): symbol {
                return VALUE;
            }
        }
        const consumer = jest.fn((v: symbol) => {
            return v;
        });
        context.invoke(consumer, {
            injections: [FACTORY_IDENTIFIER]
        });
        expect(consumer).toBeCalledWith(VALUE);
        expect(consumer).toReturnWith(VALUE);
    });
});
