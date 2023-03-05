import { AspectInfo } from './AspectInfo';
import { MetadataFactory } from '../metadata/MetadataFactory';
import { AspectClassMetadata } from './AspectClassMetadata';

export function addAspect<T>(aspect: AspectInfo<T>) {
    aspect.pointcut.getMethodsMap().forEach((_, clazz) => {
        const metadata = MetadataFactory.getMetadata(clazz, AspectClassMetadata);
        metadata.recordAspectInfo(aspect);
    });
}
