import { Metadata, MetadataReader } from '../types/Metadata';
import { Newable } from '../types/Newable';
import { AspectInfo } from './AspectInfo';
import { AdviceEnum } from './AdviceEnum';
import { DefaultValueMap } from '../common/DefaultValueMap';

export interface AspectClassMetadataReader<T> extends MetadataReader {
    getClass(): Newable<T>;
    getAdviceAspectMap(methodName: string | symbol): Map<AdviceEnum, AspectClassMap>;
    isAdviceClass(): boolean;
}
type AspectClassMap = DefaultValueMap<Newable<unknown>, Set<string | symbol>>;
export class AspectClassMetadata<T> implements Metadata<AspectClassMetadataReader<T>, Newable<T>> {
    static getReflectKey() {
        return 'ioc:aop:aspect-class-metadata';
    }
    private clazz!: Newable<T>;
    private isAdviceClass: boolean = false;
    private methodAdviceAspectMap = new DefaultValueMap<string | symbol, DefaultValueMap<AdviceEnum, AspectClassMap>>(() => {
        return new DefaultValueMap<AdviceEnum, AspectClassMap>(() => {
            return new DefaultValueMap(() => {
                return new Set<string | symbol>();
            });
        });
    });

    init(target: Newable<T>): void {
        this.clazz = target;
    }

    recordAspectInfo(aspectInfo: AspectInfo<T>) {
        const methods = aspectInfo.pointcut.getMethodsMap().get(this.clazz);
        methods!.forEach(method => {
            const adviceAspectMap = this.methodAdviceAspectMap.get(method);
            const aspectMap = adviceAspectMap.get(aspectInfo.advice);
            const aspectMethods = aspectMap.get(aspectInfo.aspectClass);
            aspectMethods.add(aspectInfo.methodName);
            this.isAdviceClass = true;
        });
    }

    reader(): AspectClassMetadataReader<T> {
        return {
            getClass: () => {
                return this.clazz;
            },
            getAdviceAspectMap: (methodName): Map<AdviceEnum, AspectClassMap> => {
                return this.methodAdviceAspectMap.get(methodName);
            },
            isAdviceClass: () => {
                return this.isAdviceClass;
            }
        };
    }
}
