import { MemberKey } from './MemberKey';

export type KeyOf<T> = keyof T extends never ? MemberKey : keyof T;
