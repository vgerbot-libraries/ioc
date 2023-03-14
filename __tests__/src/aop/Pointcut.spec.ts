import { Pointcut } from '../../../src/aop/Pointcut';

class MyClass {
    method1() {
        //
    }
    method2() {
        //
    }
    method3() {
        //
    }
}

describe('Pointcut', () => {
    describe('combine', () => {
        it('should combine two Pointcut objects', () => {
            const p1 = Pointcut.of(MyClass, 'method1');
            const p2 = Pointcut.of(MyClass, 'method2');
            const combined = Pointcut.combine(p1, p2);

            expect(combined.getMethodsMap().get(MyClass)).toEqual(new Set(['method1', 'method2']));
        });
    });

    describe('of', () => {
        it('should create a Pointcut object with specified methods of a class', () => {
            const p = Pointcut.of(MyClass, 'method1');

            expect(p.getMethodsMap().get(MyClass)).toEqual(new Set(['method1']));
        });

        it('should create a Pointcut object with all methods of a class if no method is specified', () => {
            const p = Pointcut.of(MyClass);

            expect(p.getMethodsMap().get(MyClass)).toEqual(new Set(['method1', 'method2', 'method3']));
        });
    });

    describe('testMatch', () => {
        it('should create a Pointcut object with matched methods of a class', () => {
            const p = Pointcut.testMatch(MyClass, /method/);

            expect(p.getMethodsMap().get(MyClass)).toEqual(new Set(['method1', 'method2', 'method3']));
        });
    });

    describe('from', () => {
        it('should create a Pointcut object with specified methods from multiple classes', () => {
            const p = Pointcut.from(MyClass).of('method1');

            expect(p.getMethodsMap().get(MyClass)).toEqual(new Set(['method1']));
        });

        it('should create a Pointcut object with matched methods from multiple classes', () => {
            const p = Pointcut.from(MyClass).testMatch(/method/);

            expect(p.getMethodsMap().get(MyClass)).toEqual(new Set(['method1', 'method2', 'method3']));
        });
    });

    describe('constructor', () => {
        it('should create a Pointcut object with specified method entries', () => {
            const entries = new Map([[MyClass, new Set(['method1'])]]);
            const p = new Pointcut(entries);

            expect(p.getMethodsMap().get(MyClass)).toEqual(new Set(['method1']));
        });
    });

    describe('getMethodsMap', () => {
        it('should return a Map object with all method entries', () => {
            const entries = new Map([[MyClass, new Set(['method1'])]]);
            const p = new Pointcut(entries);

            expect(p.getMethodsMap()).toEqual(entries);
        });
    });
    describe('inheritance', () => {
        class Parent {
            methodA() {
                //
            }
            methodB() {
                //
            }
        }

        class Child extends Parent {
            methodC() {
                //
            }
        }

        it('should correctly inherit parent class methods', () => {
            const pointcut = Pointcut.of(Child);

            expect(pointcut.getMethodsMap().get(Child)).toEqual(new Set(['methodA', 'methodB', 'methodC']));
        });

        it('should not contain parent class methods if not specified', () => {
            const pointcut = Pointcut.of(Child, 'methodC');

            expect(pointcut.getMethodsMap().get(Child)).toEqual(new Set(['methodC']));
        });
    });
});
