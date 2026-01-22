import { ApplicationContext } from '../../src';
import { Advice } from '../../src/aop/Advice';
import type { Aspect, JoinPoint } from '../../src/aop/Aspect';
import { UseAspects } from '../../src/aop/decorators/UseAspects';

const appCtx = new ApplicationContext();

class TestAspect implements Aspect {
    execute(ctx: JoinPoint) {
        console.log('log:', ctx);
    }
}

class Service {
    @UseAspects(Advice.Before, [TestAspect])
    chat() {
        console.log('chat');
    }
}
appCtx.getInstance(Service).chat();

class TestAfterReturnAspect implements Aspect {
    execute(jp: JoinPoint) {
        return `${jp.returnValue}-aspect`;
    }
}

class AfterReturnService {
    @UseAspects(Advice.AfterReturn, [TestAfterReturnAspect])
    testMethod() {
        return 'test';
    }
}
const returnValue = appCtx.getInstance(AfterReturnService).testMethod();
console.log(returnValue);
