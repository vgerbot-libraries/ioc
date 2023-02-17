import { Bind, ApplicationContext, Inject } from '../../src/index';

@Bind('service-name')
class Service {}

class ServiceB {
    @Inject(Service)
    public a!: Service;
    @Inject('service-name')
    public b!: Service;
}

const app = new ApplicationContext();

const sb = app.getInstance(ServiceB);
console.log(sb.a, sb.b);
