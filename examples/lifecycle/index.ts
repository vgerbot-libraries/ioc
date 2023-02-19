import { ApplicationContext, InstanceScope, PostInject, PreDestroy, PreInject, Scope } from '../../src';

function generateId() {
    return (~~(Math.random() * 10000000)).toString(16);
}

function runTransientScopeExample() {
    const app = new ApplicationContext();

    @Scope(InstanceScope.TRANSIENT)
    class TransientService {
        id = generateId();
        @PreInject()
        preInject() {
            console.log(`TransientService#${this.id}.preInject`);
        }
        @PostInject()
        postInject() {
            console.log(`TransientService#${this.id}.postInject`);
        }
        @PreDestroy()
        preDestroy() {
            console.log(`TransientService#${this.id}.preDestroy`);
        }
    }

    const transientInstance1 = app.getInstance(TransientService);
    const transientInstance2 = app.getInstance(TransientService);
    console.log(transientInstance1, transientInstance2);
    app.destroy();
}

function runSingletonScopeExample() {
    const app = new ApplicationContext();

    @Scope(InstanceScope.SINGLETON)
    class SingletonService {
        id = generateId();
        @PreInject()
        preInject() {
            console.log(`SingletonService#${this.id}.preInject`);
        }
        @PostInject()
        postInject() {
            console.log(`SingletonService#${this.id}.postInject`);
        }
        @PreDestroy()
        preDestroy() {
            console.log(`SingletonService#${this.id}.preDestroy`);
        }
    }

    const singletonInstance1 = app.getInstance(SingletonService);
    const singletonInstance2 = app.getInstance(SingletonService);
    console.log(singletonInstance1, singletonInstance2);
    app.destroy();
}

function runGlobalSharedExample() {
    const app1 = new ApplicationContext();
    const app2 = new ApplicationContext();

    @Scope(InstanceScope.GLOBAL_SHARED_SINGLETON)
    class GlobalSingletonService {
        id = generateId();
        @PreInject()
        preInject() {
            console.log(`GlobalSingletonService#${this.id}.preInject`);
        }
        @PostInject()
        postInject() {
            console.log(`GlobalSingletonService#${this.id}.postInject`);
        }
        @PreDestroy()
        preDestroy() {
            console.log(`GlobalSingletonService#${this.id}.preDestroy`);
        }
    }

    const instance1 = app1.getInstance(GlobalSingletonService);
    const instance2 = app2.getInstance(GlobalSingletonService);
    console.log(instance1, instance2);
    app1.destroy();
    app2.destroy();
}

runTransientScopeExample();
runSingletonScopeExample();
runGlobalSharedExample();
