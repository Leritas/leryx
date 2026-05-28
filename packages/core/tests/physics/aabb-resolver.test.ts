import { describe, expect, it } from 'vitest';
import { createAabb } from '../../src/math/aabb.js';
import { AabbPhysicsResolver } from '../../src/physics/aabb-resolver.js';

describe('AabbPhysicsResolver', () => {
    it('lands on a static platform', () => {
        const resolver = new AabbPhysicsResolver();
        const result = resolver.resolveAgainstStatic(createAabb(10, 20, 10, 10), { x: 0, y: 25 }, [
            createAabb(0, 40, 100, 10),
        ]);

        expect(result.position.y).toBe(30);
        expect(result.onGround).toBe(true);
        expect(result.velocity.y).toBe(0);
    });
});
