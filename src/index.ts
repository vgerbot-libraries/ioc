export { Bind } from './annotation/Bind';
export { Scope } from './annotation/Scope';
export { Inject } from './annotation/Inject';
export { Factory } from './annotation/Factory';
export { PostInject } from './annotation/PostInject';
export { PreInject } from './annotation/PreInject';
export { PreDestroy } from './annotation/PreDestroy';
export { Value } from './annotation/Value';

export { InstanceScope } from './foundation/InstanceScope';
export { ApplicationContext } from './foundation/ApplicationContext';

export function hello() {
    return 'world';
}
