/**
 * @leryx/core/reactivity — thin wrapper over @preact/signals-core.
 *
 * Re-exports signals primitives; engine scheduling hooks will be added in M1.
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
