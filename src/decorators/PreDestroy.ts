import { Lifecycle } from '../foundation/Lifecycle';
import { LifecycleDecorator } from './LifecycleDecorator';

export const PreDestroy = () => LifecycleDecorator(Lifecycle.PRE_DESTROY);
