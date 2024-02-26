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
            expect(combined.test(MyClass, 'method1')).toBeTruthy();
            expect(combined.test(MyClass, 'method2')).toBeTruthy();
            expect(combined.test(MyClass, 'method3')).toBeFalsy();
        });
    });

    describe('of', () => {
        it('should create a Pointcut object with specified methods of a class', () => {
            const p = Pointcut.of(MyClass, 'method1');

            expect(p.test(MyClass, 'method1')).toBeTruthy();
        });

        it('should create a Pointcut object with all methods of a class if no method is specified', () => {
            const p = Pointcut.of(MyClass);
            expect(p.test(MyClass, 'method1')).toBeTruthy();
            expect(p.test(MyClass, 'method2')).toBeTruthy();
            expect(p.test(MyClass, 'method3')).toBeTruthy();
            expect(p.test(MyClass, 'method4')).toBeFalsy();
        });
    });

    describe('testMatch', () => {
        it('should create a Pointcut object with matched methods of a class', () => {
            const p = Pointcut.testMatch(MyClass, /method/);
            expect(p.test(MyClass, 'method1')).toBeTruthy();
            expect(p.test(MyClass, 'method2')).toBeTruthy();
            expect(p.test(MyClass, 'method3')).toBeTruthy();
            expect(p.test(MyClass, 'method4')).toBeTruthy();
        });
    });

    describe('from', () => {
        it('should create a Pointcut object with specified methods from multiple classes', () => {
            const p = Pointcut.from(MyClass).of('method1');
            expect(p.test(MyClass, 'method1')).toBeTruthy();
        });

        it('should create a Pointcut object with matched methods from multiple classes', () => {
            const p = Pointcut.from(MyClass).testMatch(/method/);

            expect(p.test(MyClass, 'method1')).toBeTruthy();
            expect(p.test(MyClass, 'method2')).toBeTruthy();
            expect(p.test(MyClass, 'method3')).toBeTruthy();
            expect(p.test(MyClass, 'method4')).toBeTruthy();
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
            expect(pointcut.test(Child, 'methodA')).toBeTruthy();
            expect(pointcut.test(Child, 'methodB')).toBeTruthy();
            expect(pointcut.test(Child, 'methodC')).toBeTruthy();
        });

        it('should not contain parent class methods if not specified', () => {
            const pointcut = Pointcut.of(Child, 'methodC');
            expect(pointcut.test(Child, 'methodA')).toBeFalsy();
            expect(pointcut.test(Child, 'methodC')).toBeTruthy();
        });
    });
});
