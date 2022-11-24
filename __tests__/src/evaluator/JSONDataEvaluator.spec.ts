import { ApplicationContext } from '../../../src';
import { JSONDataEvaluator } from '../../../src/evaluator/JSONDataEvaluator';

describe('JSONDataEvaluator', () => {
    const ctx = new ApplicationContext();
    const evaluator = new JSONDataEvaluator();
    evaluator.recordData('a', {
        a: 'a'
    });
    it('Should throw an error if the expression is not including colon', () => {
        expect(() => {
            evaluator.eval(ctx, 'a.b');
        }).toThrowError('Incorrect expression, namespace not specified');
    });
    it('Should throw an error if the expression including comma: ","', () => {
        expect(() => {
            evaluator.eval(ctx, 'a:a.b,c.d');
        }).toThrowError(/^Incorrect expression syntax, The ',' is not allowed in expression/);
    });
    it('Should throw an error if the expression length is greater than 120', () => {
        expect(() => {
            evaluator.eval(ctx, 'a:' + Array(121).fill('a').join(''));
        }).toThrowError('Incorrect expression syntax, expression length cannot be greater than 120, but actual: 121');
    });
    it('Should throw an error if the expression including parentheses', () => {
        expect(() => {
            evaluator.eval(ctx, 'a:evil()');
        }).toThrowError('');
    });
});
