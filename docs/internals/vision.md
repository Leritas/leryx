# Vision — what is Leryx.js?

## Problem

Classic web game code tends toward an **imperative game loop**: one `update(dt)` mutates global state, one `draw(ctx)` reads it. That scales poorly when:

- State is scattered across closures and singletons.
- UI, gameplay, and rendering are coupled in the same functions.
- Refactoring (new level, new entity type) requires tracing manual wiring.

Meanwhile, modern **web application** stacks (Angular, React) solved structure with **components**, **dependency injection**, and **fine-grained reactivity** — but those tools are not game engines and do not own Canvas/WebGL frame budgets.

**Leryx.js** bridges that gap: **declarative game structure** with **imperative performance** under the hood.

## What Leryx.js is

Leryx.js is a **TypeScript-first, 2D-first** browser game framework where you:

- Declare **modules**, **levels**, and **entities** with decorators (Angular-style).
- Hold game state in **signals** (`@preact/signals-core`).
- React to changes with **`effect()`** and entity-scoped **`useHook()`**.
- Let the engine compile visual output into a **batched render command stream** for Canvas2D (later WebGL).

The developer rarely calls `ctx.fillRect` directly; the **RenderPhase** does, driven by entity transforms and draw metadata.

## Philosophy: web development meets game development

| From web (Angular/React) | From gamedev                 |
| ------------------------ | ---------------------------- |
| Modules & DI             | Fixed/variable timestep      |
| Component lifecycle      | Input polling                |
| Signals / effects        | Draw command batching        |
| Tree-shaped ownership    | Dirty flags & minimal redraw |

Leryx does **not** try to be a general UI framework. It borrows **structure and reactivity**, not DOM reconciliation. The “VDOM” equivalent is the **draw command list** rebuilt only for dirty entities.

## Key features

### Declarative object graph

- `@Scene` — application root container.
- `@Level` — loadable game slice (map, wave, menu screen).
- `@Entity` — gameplay object in the level tree.
- `@Item` — pickups, inventory entries, interactables.

### Angular-like modules & DI

- `@LeryxModule({ imports, providers, declarations })` registers types.
- `@Injectable()` services (input, assets, audio) injected via `inject()`.
- Child injectors per level for scoped services.

### Signal-based reactivity

- `@leryx/core/reactivity` wraps `@preact/signals-core`.
- Property bindings and `effect()` scheduled **before** the Update phase each frame.
- `batch()` for atomic multi-signal updates.

### Strict Update / Render separation

- **Update:** physics, input, AI, lifecycle `onUpdate` / `onFixedUpdate`.
- **Render:** read-only snapshot → `DrawCommand[]` → backend (Canvas2D → WebGL).

### Performance path

Declarative API → metadata registry → scheduler → command buffer → GPU/Canvas. No per-frame full-tree reconciliation in M1; dirty subtrees only.

### Monorepo & plugins

- Core: `@leryx/core`.
- Optional: `@leryx/server`, `@leryx/overlays`, `@leryx/store`, `@leryx/audio`, and future packages under `plugins/`.
- **`@leryx/overlays`** — three layers: DevTools (scene + level flow graph), debug overlay (FPS / metrics), Game UI (menus, HUD, inventory). See [plugins/overlays/roadmap.md](../../plugins/overlays/roadmap.md).
- **`@leryx/store`** (Post-1.0) — NGXS-style global state: custom `@State` slices, actions, selectors, `localStorage` persistence.
- **Entity animation** (Post-1.0) — spritesheet clips and state machines on `@Entity`, after M3 assets/WebGL.
- **npm workspaces** for local linking (semver-aligned `dependencies` → symlink to `packages/core`).

## Non-goals (v0 / through M1)

- 3D rendering (math/renderer designed for extension, not shipped in M1).
- Visual scene editor.
- WASM physics core.
- Full multiplayer stack (stub plugin only until M4).
- `reflect-metadata` / legacy experimental decorators (we use **TC39 Stage 3** + custom metadata registry).

## Target developer

Teams and solo devs who already know **TypeScript** and **Angular or React signals**, want a **browser-native** 2D engine without Unity/Godot export, and value **readable game architecture** over raw loop control.

## Success criteria for the framework

1. A minimal game (e.g. jumping cube) fits in **modules + entities**, not a 500-line `main.ts`.
2. Signal updates do not force full-scene redraws.
3. Published packages install cleanly from npm with documented peer deps.
4. Internal docs allow a new contributor to locate Update vs Render code in under 10 minutes.

See [roadmap.md](roadmap.md) for versioned delivery.
