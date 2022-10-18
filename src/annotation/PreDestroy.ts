import { LifecycleDecorator } from './LifecycleDecorator';
import { Lifecycle } from '../foundation/Lifecycle';

export const PreDestroy = () => LifecycleDecorator(Lifecycle.PRE_DESTROY);
