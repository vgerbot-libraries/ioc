import { AnyFunction } from '../types/AnyFunction';
import { ApplicationContext } from './ApplicationContext';

export type ServiceFactory<R, O = any> = (container: ApplicationContext, owner?: O) => AnyFunction<void, R>;
