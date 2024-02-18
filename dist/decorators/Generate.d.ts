import { ApplicationContext } from '../foundation';
export declare function Generate<V>(generator: <T>(this: T, appCtx: ApplicationContext) => V): PropertyDecorator;
