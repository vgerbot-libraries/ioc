import { AnyFunction } from '../types/AnyFunction';
export type EventListener = AnyFunction;
export declare class EventEmitter {
    private readonly events;
    on(type: string | symbol, listener: EventListener): () => void;
    emit(type: string | symbol, ...args: unknown[]): void;
}
