export type EventListener = () => void;
export class EventEmitter {
    private readonly events = new Map<string | symbol, EventListener[]>();

    on(type: string | symbol, listener: EventListener) {
        let listeners = this.events.get(type);
        if (listeners) {
            if (listeners.indexOf(listener) == -1) {
                listeners.push(listener);
            }
        } else {
            listeners = [];
            this.events.set(type, listeners);
        }
        return () => {
            const ls = listeners as EventListener[];
            const index = ls.indexOf(listener);
            if (index > -1) {
                ls.splice(index, 1);
            }
        };
    }
}
