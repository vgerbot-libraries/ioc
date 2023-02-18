import { EventEmitter } from '../../src/foundation/EventEmitter';

describe('EventEmitter', () => {
    it('should trigger events and remove them correctly', () => {
        const emitter = new EventEmitter();

        const callback = jest.fn();

        const off = emitter.on('test', callback);

        emitter.emit('test');

        expect(callback).toHaveBeenCalledTimes(1);

        off();

        emitter.emit('test');

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should trigger an event one time when added same callback multiple times', () => {
        const emitter = new EventEmitter();

        const callback = jest.fn();

        emitter.on('test', callback);
        emitter.on('test', callback);

        emitter.emit('test');

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should pass parameters when triggering events', () => {
        const emitter = new EventEmitter();

        const callback = jest.fn((a, b) => {
            expect(a).toBe('foo');
            expect(b).toBe('bar');
        });

        emitter.on('test', callback);

        emitter.emit('test', 'foo', 'bar');

        expect(callback).toHaveBeenCalledWith('foo', 'bar');
    });
});
