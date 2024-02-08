import { Injectable } from '../../../src/decorators/Injectable';
import { ApplicationContext } from '../../../src/foundation/ApplicationContext';

describe('@Injectable', () => {
    it('should inject a single instance', () => {
        class ServiceWithoutInjectable {}
        @Injectable()
        class ServiceWithInjectable {}
        const context = new ApplicationContext();

        expect(context.getInstance(ServiceWithoutInjectable)).toBe(context.getInstance(ServiceWithoutInjectable));
        expect(context.getInstance(ServiceWithInjectable)).toBe(context.getInstance(ServiceWithInjectable));
    });

    it('should inject multiple instances', () => {
        const HTTP_INTERCEPTOR = Symbol('produce-http-inteceptor');
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface Inteceptor {}
        @Injectable({
            produce: HTTP_INTERCEPTOR
        })
        class AuthInteceptor implements Inteceptor {}

        @Injectable({
            produce: HTTP_INTERCEPTOR
        })
        class LoggingInteceptor implements Inteceptor {}

        @Injectable({
            produce: HTTP_INTERCEPTOR
        })
        class NoopInteceptor implements Inteceptor {}

        const context = new ApplicationContext();

        const inteceptors = context.getInstance(HTTP_INTERCEPTOR) as Inteceptor[];

        expect(Array.isArray(inteceptors)).toBeTruthy();

        expect(inteceptors[0]).toBeInstanceOf(AuthInteceptor);
        expect(inteceptors[1]).toBeInstanceOf(LoggingInteceptor);
        expect(inteceptors[2]).toBeInstanceOf(NoopInteceptor);
    });
    it('should produce multiple symbols', () => {
        const HTTP_INTERCEPTOR = Symbol('produce-http-interceptor');
        const DATA_PARSER = Symbol('produce-data-parser');

        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface DataParser {}
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface Interceptor {}

        @Injectable({
            produce: [HTTP_INTERCEPTOR, DATA_PARSER]
        })
        class ParserAndInteceptorImpl implements Interceptor, DataParser {}

        const context = new ApplicationContext();
        const interceptors = context.getInstance(HTTP_INTERCEPTOR) as Interceptor[];
        const parsers = context.getInstance(DATA_PARSER) as DataParser[];

        expect(interceptors[0]).toBe(parsers[0]);
        expect(interceptors[0]).toBeInstanceOf(ParserAndInteceptorImpl);
    });
});
