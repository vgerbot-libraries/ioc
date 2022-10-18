import { Lifecycle } from './Lifecycle';

export const METADATA_KEY = Symbol('urn-metadata');

export interface MethodMemberMetadata {
    lifecycle?: Lifecycle[];
}
