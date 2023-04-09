export declare class ComponentInstanceWrapper {
    readonly instance: unknown;
    readonly serialNo: number;
    constructor(instance: unknown);
    compareTo(other: ComponentInstanceWrapper): -1 | 0 | 1;
}
