import { ApplicationContext } from '../../src';
import { Aspect, JoinPoint } from '../../src/aop/Aspect';
import { UseAspects } from '../../src/aop/decorators/UseAspects';
import { Advice } from '../../src/aop/Advice';

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
        return jp.returnValue + '-aspect';
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
