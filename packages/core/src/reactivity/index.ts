/**
 * @leryx/core/reactivity — thin wrapper over @preact/signals-core.
 */

export {
    signal,
    computed,
    effect,
    batch,
    untracked,
    type Signal,
    type ReadonlySignal,
} from '@preact/signals-core';

export {
    scheduleEffect,
    flushScheduledEffects,
    setSignalFlushCallback,
} from './effect-scheduler.js';
