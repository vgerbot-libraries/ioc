let instanceSerialNo = -1;

export class ComponentInstanceWrapper {
    public readonly serialNo = ++instanceSerialNo;

    constructor(public readonly instance: unknown) {}

    public compareTo(other: ComponentInstanceWrapper): -1 | 0 | 1 {
        return this.serialNo > other.serialNo ? -1 : this.serialNo < other.serialNo ? 1 : 0;
    }
}
