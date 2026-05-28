import { batch } from '@preact/signals-core';

const scheduledEffects: Array<() => void> = [];
let flushCallback: (() => void) | null = null;

export function scheduleEffect(fn: () => void): void {
    scheduledEffects.push(fn);
}

export function setSignalFlushCallback(callback: () => void): void {
    flushCallback = callback;
}

export function flushScheduledEffects(): void {
    const pending = scheduledEffects.splice(0, scheduledEffects.length);
    if (pending.length === 0 && !flushCallback) {
        return;
    }

    batch(() => {
        for (const fn of pending) {
            fn();
        }
        flushCallback?.();
    });
}
