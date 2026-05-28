import type { Vec2 } from '../math/vec2.js';

export interface Aabb {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export interface ColliderProvider {
    getCollider(): Readonly<Aabb>;
}

export interface StaticColliderProvider extends ColliderProvider {
    readonly kind: 'static';
}

export interface ResolveResult {
    readonly position: Readonly<Aabb>;
    readonly velocity: Vec2;
    readonly onGround: boolean;
}

export interface PhysicsResolver {
    resolveAgainstStatic(movable: Aabb, velocity: Vec2, statics: readonly Aabb[]): ResolveResult;
}
