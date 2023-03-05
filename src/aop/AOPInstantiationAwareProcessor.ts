import { PartialInstAwareProcessor } from '../types/InstantiationAwareProcessor';
import { MetadataFactory } from '../metadata/MetadataFactory';
import { AspectClassMetadata } from './AspectClassMetadata';

export class AOPInstantiationAwareProcessor implements PartialInstAwareProcessor {
    afterInstantiation<T extends Object>(instance: T): T {
        const clazz = instance.constructor;
        const metadata = MetadataFactory.getMetadata(clazz, AspectClassMetadata);
        console.log(metadata);
        const proxyResult = new Proxy(instance, {
            apply: () => {
                //
            }
        });
        return proxyResult;
    }
}
