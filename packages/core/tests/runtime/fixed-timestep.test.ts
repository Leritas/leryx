import { describe, expect, it } from 'vitest';
import {
    DEFAULT_FIXED_TIMESTEP_HZ,
    FixedTimestepAccumulator,
    fixedTimestepFromHz,
} from '../../src/runtime/fixed-timestep.js';

describe('FixedTimestepAccumulator', () => {
    it('derives fixed dt from hz', () => {
        expect(fixedTimestepFromHz(DEFAULT_FIXED_TIMESTEP_HZ)).toBeCloseTo(1 / 60);
    });

    it('consumes one step for a 16ms frame', () => {
        const accumulator = new FixedTimestepAccumulator({
            fixedDt: 1 / 60,
            maxStepsPerFrame: 5,
        });

        const result = accumulator.consume(1 / 60);
        expect(result.steps).toBe(1);
        expect(result.frameDt).toBeCloseTo(1 / 60);
    });

    it('caps fixed steps when lagging behind', () => {
        const accumulator = new FixedTimestepAccumulator({
            fixedDt: 1 / 60,
            maxStepsPerFrame: 5,
        });

        const result = accumulator.consume(0.1);
        expect(result.steps).toBe(3);
        expect(result.frameDt).toBe(0.05);
    });

    it('returns zero steps when frame dt is below fixed dt', () => {
        const accumulator = new FixedTimestepAccumulator({
            fixedDt: 1 / 60,
            maxStepsPerFrame: 5,
        });

        const result = accumulator.consume(1 / 120);
        expect(result.steps).toBe(0);
    });
});
