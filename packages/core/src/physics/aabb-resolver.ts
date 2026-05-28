import { createAabb, intersects, resolveOverlapX, resolveOverlapY } from '../math/aabb.js';
import { cloneVec2 } from '../math/vec2.js';
import type { Aabb, PhysicsResolver, ResolveResult } from './types.js';
import type { Vec2 } from '../math/vec2.js';

function minOverlapX(movable: Aabb, staticBox: Aabb): number {
    return Math.min(
        movable.x + movable.width - staticBox.x,
        staticBox.x + staticBox.width - movable.x,
    );
}

function minOverlapY(movable: Aabb, staticBox: Aabb): number {
    return Math.min(
        movable.y + movable.height - staticBox.y,
        staticBox.y + staticBox.height - movable.y,
    );
}

export class AabbPhysicsResolver implements PhysicsResolver {
    resolveAgainstStatic(movable: Aabb, velocity: Vec2, statics: readonly Aabb[]): ResolveResult {
        let x = movable.x + velocity.x;
        let y = movable.y + velocity.y;
        let vy = velocity.y;
        let onGround = false;
        const descending = vy > 0;

        let box = createAabb(x, y, movable.width, movable.height);

        for (const staticBox of statics) {
            if (!intersects(box, staticBox)) {
                continue;
            }

            const overlapX = minOverlapX(box, staticBox);
            const overlapY = minOverlapY(box, staticBox);

            if (overlapX < overlapY) {
                x = resolveOverlapX(box, staticBox);
                box = createAabb(x, box.y, box.width, box.height);
                continue;
            }

            const resolvedY = resolveOverlapY(box, staticBox, descending);
            if (descending && resolvedY === staticBox.y - box.height) {
                onGround = true;
                vy = 0;
            }
            y = resolvedY;
            box = createAabb(box.x, y, box.width, box.height);
        }

        return {
            position: box,
            velocity: cloneVec2({ x: velocity.x, y: vy }),
            onGround,
        };
    }
}
