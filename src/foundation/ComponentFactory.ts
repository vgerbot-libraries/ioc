import { ComponentContainer } from './ComponentContainer';

export type ComponentFactory<O = unknown> = (container: ComponentContainer, owner?: O) => PropertyDescriptor;
