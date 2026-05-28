import type { EntityHost } from '../scene/entity-host.js';
import { flushScheduledEffects } from '../reactivity/effect-scheduler.js';

import { DEFAULT_FIXED_TIMESTEP_HZ, fixedTimestepFromHz } from './fixed-timestep.js';

export { MAX_FRAME_DELTA } from './timestep-constants.js';
export const FIXED_TIMESTEP = fixedTimestepFromHz(DEFAULT_FIXED_TIMESTEP_HZ);

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
    flush(): void {
        flushScheduledEffects();
    }
}
