import type { ApplicationContext } from '../foundation/ApplicationContext';
import type { AnyFunction } from './AnyFunction';

export type ServiceFactory<R, O> = (container: ApplicationContext, owner?: O) => AnyFunction<R>;
