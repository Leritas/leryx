import { MAX_FRAME_DELTA } from './timestep-constants.js';

export const DEFAULT_FIXED_TIMESTEP_HZ = 60;

export function fixedTimestepFromHz(hz: number): number {
    if (hz <= 0) {
        throw new Error('@leryx/core: fixedTimestepHz must be greater than 0.');
    }
    return 1 / hz;
}

export interface FixedTimestepAccumulatorOptions {
    fixedDt: number;
    maxStepsPerFrame: number;
}

export interface FixedTimestepConsumeResult {
    steps: number;
    fixedDt: number;
    frameDt: number;
}

export class FixedTimestepAccumulator {
    private accumulator = 0;

    constructor(private readonly options: FixedTimestepAccumulatorOptions) {}

    get fixedDt(): number {
        return this.options.fixedDt;
    }

    consume(frameDt: number): FixedTimestepConsumeResult {
        const clampedDt = Math.min(frameDt, MAX_FRAME_DELTA);
        this.accumulator += clampedDt;

        let steps = 0;
        while (this.accumulator >= this.options.fixedDt && steps < this.options.maxStepsPerFrame) {
            this.accumulator -= this.options.fixedDt;
            steps += 1;
        }

        return {
            steps,
            fixedDt: this.options.fixedDt,
            frameDt: clampedDt,
        };
    }

    reset(): void {
        this.accumulator = 0;
    }
}
