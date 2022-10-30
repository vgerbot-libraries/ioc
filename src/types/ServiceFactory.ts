import { AnyFunction } from './AnyFunction';
import { ApplicationContext } from '../foundation/ApplicationContext';

export type ServiceFactory<R, O = any> = (container: ApplicationContext, owner?: O) => AnyFunction<void, R>;
