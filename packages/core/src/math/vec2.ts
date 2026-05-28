export interface Vec2 {
    readonly x: number;
    readonly y: number;
}

export function vec2(x: number, y: number): Vec2 {
    return { x, y };
}

export function addVec2(a: Vec2, b: Vec2): Vec2 {
    return { x: a.x + b.x, y: a.y + b.y };
}

export function scaleVec2(v: Vec2, scalar: number): Vec2 {
    return { x: v.x * scalar, y: v.y * scalar };
}

export function cloneVec2(v: Vec2): Vec2 {
    return { x: v.x, y: v.y };
}
