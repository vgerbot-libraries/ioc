import type { ApplicationContext } from '../foundation/ApplicationContext';
import { UseAspectMetadataReader } from './AOPClassMetadata';
export declare function createAspect<T>(appCtx: ApplicationContext, target: T, methodName: string | symbol, methodFunc: Function, metadata: UseAspectMetadataReader): (this: any, ...args: any[]) => any;
