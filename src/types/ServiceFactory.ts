import { AnyFunction } from './AnyFunction';
import { ApplicationContext } from '../foundation/ApplicationContext';

export type ServiceFactory<R, O> = (container: ApplicationContext, owner?: O) => AnyFunction<R>;
