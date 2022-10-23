export function hello() {
    return 'world';
}
function Inject(): ParameterDecorator {
    return function (target, key, index) {
        console.log(typeof target, key, index);
    };
}

function InjectAll(): ClassDecorator {
    return (constr: Function) => {
        console.log(constr);
    };
}

@InjectAll()
class A {
    constructor(@Inject() a: string) {
        // PASS
    }
    hello(@Inject() b: string) {
        // PASS
    }
}

new A('123456').hello('asdasd');
