import { Mark } from '../../../src';
import { ApplicationContext } from '../../../src';

describe('@Mark decorator', () => {
    it('should mark a class with a custom value', () => {
        @Mark('myKey', 'customValue')
        class MyClass {}

        const app = new ApplicationContext();
        const info = app.getClassMetadata(MyClass).getCtorMarkInfo();
        expect(info['myKey']).toBe('customValue');
    });
    it('should mark a method with a custom value', () => {
        class MyClass {
            @Mark('myKey', 'customValue')
            method() {
                //
            }
        }

        const app = new ApplicationContext();
        const info = app.getClassMetadata(MyClass).getMembersMarkInfo('method');
        expect(info['myKey']).toBe('customValue');
    });
    it('should mark a property with a custom value', () => {
        class MyClass {
            @Mark('myKey', 'customValue')
            public property: number = 0;
        }

        const app = new ApplicationContext();
        const info = app.getClassMetadata(MyClass).getMembersMarkInfo('property');
        expect(info['myKey']).toBe('customValue');
    });
    it('should mark a parameter with a custom value', () => {
        class MyClass {
            method(@Mark('myKey', 'customValue') value: string) {
                //
            }
        }

        const app = new ApplicationContext();
        const info = app.getClassMetadata(MyClass).getParameterMarkInfo('method');
        expect(info[0]['myKey']).toBe('customValue');
    });
});
