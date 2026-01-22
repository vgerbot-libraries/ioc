import { ApplicationContext } from '../../src';
import { EnvironmentEvaluator } from '../../src/evaluator/EnvironmentEvaluator';

describe('EnvironmentEvaluator', () => {
    const env = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = {
            NODE_ENV: 'development'
        };
    });
    it('Should be able to obtain environment variables', () => {
        const ctx = new ApplicationContext();
        const value = new EnvironmentEvaluator().eval(ctx, 'NODE_ENV');
        expect(value).toBe('development');
    });
    afterEach(() => {
        process.env = env;
    });
});
