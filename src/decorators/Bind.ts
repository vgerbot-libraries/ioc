import { Alias } from './Alias';
/**
 * @deprecated use @Alias instead
 * @param aliasName
 * @returns
 */
export function Bind(aliasName: string | symbol): ClassDecorator {
    return Alias(aliasName);
}
