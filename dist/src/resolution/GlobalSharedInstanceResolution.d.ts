import { GetInstanceOptions, InstanceResolution, SaveInstanceOptions } from '../types/InstanceResolution';
export declare class GlobalSharedInstanceResolution implements InstanceResolution {
    getInstance<T, O>(options: GetInstanceOptions<T, O>): T;
    saveInstance<T, O>(options: SaveInstanceOptions<T, O>): void;
    shouldGenerate<T, O>(options: GetInstanceOptions<T, O>): boolean;
    destroy(): void;
}
