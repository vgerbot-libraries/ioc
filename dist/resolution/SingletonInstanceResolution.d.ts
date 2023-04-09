import { GetInstanceOptions, InstanceResolution, SaveInstanceOptions } from '../types/InstanceResolution';
export declare class SingletonInstanceResolution implements InstanceResolution {
    private readonly INSTANCE_MAP;
    getInstance<T, O>(options: GetInstanceOptions<T, O>): T;
    saveInstance<T, O>(options: SaveInstanceOptions<T, O>): void;
    shouldGenerate<T, O>(options: GetInstanceOptions<T, O>): boolean;
    destroy(): void;
}
