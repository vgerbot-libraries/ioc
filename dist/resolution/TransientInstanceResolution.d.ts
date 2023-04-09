import { InstanceResolution, SaveInstanceOptions } from '../types/InstanceResolution';
export declare class TransientInstanceResolution implements InstanceResolution {
    private readonly instances;
    shouldGenerate(): boolean;
    getInstance<T>(): T | undefined;
    saveInstance<T, O>(options: SaveInstanceOptions<T, O>): void;
    destroy(): void;
}
