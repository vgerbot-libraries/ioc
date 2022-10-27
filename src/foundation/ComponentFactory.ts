import { ApplicationContext } from './ApplicationContext';
import { UnknownTypeInstance } from './UnknownTypeInstance';

export type ComponentFactory<O extends UnknownTypeInstance = UnknownTypeInstance> = (
    container: ApplicationContext,
    owner?: O
) => PropertyDescriptor;
