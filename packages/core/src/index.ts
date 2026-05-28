/**
 * @leryx/core — Leryx.js game engine core.
 */

export const LERYX_VERSION = '0.1.0' as const;

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

export { useHook } from './reactivity/hooks.js';
export type { HookDisposer } from './reactivity/hooks.js';

export type { EntityLifecycle, LevelLifecycle, SceneLifecycle } from './runtime/lifecycle.js';

export type {
    DrawCommand,
    RenderBackend,
    RectRenderDescriptor,
    Viewport,
} from './renderer/types.js';

export { Canvas2DBackend } from './renderer/canvas2d-backend.js';
export { FrameScheduler } from './runtime/frame-scheduler.js';
export { FIXED_TIMESTEP } from './runtime/update-phase.js';
