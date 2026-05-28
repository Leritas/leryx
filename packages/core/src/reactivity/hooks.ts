import { effect } from '@preact/signals-core';
import type { EntityHost } from '../scene/entity-host.js';

let activeEntityHost: EntityHost | null = null;
let hookSetupAllowed = false;

export function beginEntityInit(host: EntityHost): void {
    activeEntityHost = host;
    hookSetupAllowed = true;
}

export function endEntityInit(): void {
    hookSetupAllowed = false;
    activeEntityHost = null;
}

export type HookDisposer = () => void;

export function useHook(setup: () => HookDisposer | void): void {
    if (!hookSetupAllowed || !activeEntityHost) {
        throw new Error('@leryx/core: useHook() is only valid inside entity onInit().');
    }

    const disposer = setup();
    if (typeof disposer === 'function') {
        activeEntityHost.registerHookDisposer(disposer);
    }
    activeEntityHost.markDirty();
}

export function getActiveEntityHost(): EntityHost | null {
    return activeEntityHost;
}

/** Runs a visual effect and marks the owning entity dirty after each run. */
export function trackVisualEffect(fn: () => void): () => void {
    return effect(() => {
        fn();
        getActiveEntityHost()?.markDirty();
    });
}
