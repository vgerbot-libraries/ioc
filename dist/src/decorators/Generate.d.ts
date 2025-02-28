import { ApplicationContext } from '../foundation';
export declare function Generate<T, V>(generator: (this: T, appCtx: ApplicationContext) => V): PropertyDecorator;
