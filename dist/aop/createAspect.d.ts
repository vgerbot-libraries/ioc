import type { ApplicationContext } from '../foundation/ApplicationContext';
import { AspectInfo } from './AspectMetadta';
export declare function createAspect<T>(appCtx: ApplicationContext, target: T, methodName: string | symbol, methodFunc: Function, aspects: AspectInfo[]): (this: any, ...args: any[]) => any;
