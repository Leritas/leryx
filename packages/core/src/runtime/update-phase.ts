import type { EntityHost } from '../scene/entity-host.js';
import type { DirtySet } from './dirty-set.js';
import { flushScheduledEffects } from '../reactivity/effect-scheduler.js';

export const FIXED_TIMESTEP = 1 / 60;
export const MAX_FRAME_DELTA = 0.05;

export class UpdatePhase {
    runFixedUpdate(entities: readonly EntityHost[], dt: number): void {
        for (const entity of entities) {
            entity.fixedUpdate(dt);
        }
    }

    runVariableUpdate(entities: readonly EntityHost[], dt: number): void {
        for (const entity of entities) {
            entity.update(dt);
        }
    }
}

export class SignalFlushPhase {
    constructor(private readonly dirtySet: DirtySet) {}

    flush(entities: readonly EntityHost[]): void {
        flushScheduledEffects();

        if (this.dirtySet.isEmpty()) {
            for (const entity of entities) {
                this.dirtySet.mark(entity.id);
            }
        }
    }
}
