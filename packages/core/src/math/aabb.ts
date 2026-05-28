import type { Aabb } from '../physics/types.js';

export function createAabb(x: number, y: number, width: number, height: number): Aabb {
    return { x, y, width, height };
}

export function intersects(a: Readonly<Aabb>, b: Readonly<Aabb>): boolean {
    return (
        a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
    );
}

export function containsPoint(aabb: Readonly<Aabb>, x: number, y: number): boolean {
    return x >= aabb.x && x <= aabb.x + aabb.width && y >= aabb.y && y <= aabb.y + aabb.height;
}

export function resolveOverlapX(movable: Aabb, staticBox: Aabb): number {
    if (!intersects(movable, staticBox)) {
        return movable.x;
    }

    const movableCenterX = movable.x + movable.width / 2;
    const staticCenterX = staticBox.x + staticBox.width / 2;

    if (movableCenterX < staticCenterX) {
        return staticBox.x - movable.width;
    }

    return staticBox.x + staticBox.width;
}

export function resolveOverlapY(movable: Aabb, staticBox: Aabb, descending = false): number {
    if (!intersects(movable, staticBox)) {
        return movable.y;
    }

    if (descending) {
        return staticBox.y - movable.height;
    }

    const overlapTop = movable.y + movable.height - staticBox.y;
    const overlapBottom = staticBox.y + staticBox.height - movable.y;

    if (overlapTop < overlapBottom) {
        return staticBox.y - movable.height;
    }

    return staticBox.y + staticBox.height;
}
