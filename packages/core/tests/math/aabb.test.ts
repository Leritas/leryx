import { describe, expect, it } from 'vitest';
import { createAabb, intersects, resolveOverlapY } from '../../src/math/aabb.js';

describe('aabb', () => {
    it('detects intersection', () => {
        const a = createAabb(0, 0, 10, 10);
        const b = createAabb(5, 5, 10, 10);
        expect(intersects(a, b)).toBe(true);
    });

    it('resolves vertical overlap onto static surface', () => {
        const movable = createAabb(10, 30, 10, 10);
        const ground = createAabb(0, 40, 100, 10);
        expect(resolveOverlapY(movable, ground, true)).toBe(30);
    });
});
