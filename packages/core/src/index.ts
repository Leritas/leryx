/**
 * @leryx/core — Leryx.js game engine core.
 */

export const LERYX_VERSION = '0.3.0' as const;

export { bootstrapLeryx } from './bootstrap.js';
export type { BootstrapLeryxOptions, BootstrapLeryxResult } from './bootstrap.js';

export { LeryxModule, Injectable } from './di/decorators.js';
export { inject } from './di/inject.js';
export { LeryxMetadataRegistry } from './di/metadata-registry.js';
export type {
    EntityMetadata,
    InjectableMetadata,
    ItemMetadata,
    LevelMetadata,
    LeryxModuleMetadata,
    SceneMetadata,
    InjectionToken,
} from './di/tokens.js';

export { Scene } from './decorators/scene.js';
export { Level } from './decorators/level.js';
export { Entity } from './decorators/entity.js';
export { Item } from './decorators/item.js';

export { useHook, trackVisualEffect } from './reactivity/hooks.js';
export type { HookDisposer } from './reactivity/hooks.js';

export type { EntityLifecycle, LevelLifecycle, SceneLifecycle } from './runtime/lifecycle.js';
export type { ItemLifecycle } from './scene/item-collect-system.js';

export { LevelService } from './scene/level-service.js';
export { AabbPhysicsResolver } from './physics/aabb-resolver.js';
export { createAabb, intersects } from './math/aabb.js';
export type {
    Aabb,
    ColliderProvider,
    PhysicsResolver,
    ResolveResult,
    StaticColliderProvider,
} from './physics/types.js';
export type { Vec2 } from './math/vec2.js';
export { vec2, addVec2, scaleVec2, cloneVec2 } from './math/vec2.js';

export type {
    DrawCommand,
    RenderBackend,
    RectRenderDescriptor,
    TextRenderDescriptor,
    Viewport,
} from './renderer/types.js';

export { Canvas2DBackend } from './renderer/canvas2d-backend.js';
export { InputService } from './input/input-service.js';
export { InputModule } from './input/input.module.js';
export { FrameScheduler } from './runtime/frame-scheduler.js';
export { DEFAULT_FIXED_TIMESTEP_HZ, fixedTimestepFromHz } from './runtime/fixed-timestep.js';
export { FIXED_TIMESTEP } from './runtime/update-phase.js';
