# Roadmap — Leryx.js to v1.0

Versioning is **per package** in the monorepo (`@leryx/core`, `@leryx/server`, …). Tags and publish rules: [publishing.md](publishing.md).

## Overview

```mermaid
gantt
  title Leryx.js milestones
  dateFormat YYYY-MM
  section Core
  M1_PoC           :m1, 2026-05, 2M
  M2_Alpha         :m2, after m1, 2M
  M3_Beta          :m3, after m2, 2M
  M4_Release       :m4, after m3, 2M
```

| Milestone      | Target `@leryx/core` | Theme                                   |
| -------------- | -------------------- | --------------------------------------- |
| **M1 — PoC**   | `0.1.x`              | Loop, DI, decorators, Canvas2D, signals |
| **M2 — Alpha** | `0.3.x`              | Physics, input, level loading           |
| **M3 — Beta**  | `0.7.x`              | WebGL, assets, overlays plugin          |
| **M4 — 1.0**   | `1.0.0`              | Server stub, DevTools, user docs        |

---

## Milestone 1 — PoC

**Goal:** Prove the declarative model runs at 60fps for a trivial game.

### Deliverables

- [ ] `bootstrapLeryx()` — module → scene → scheduler
- [ ] `LeryxMetadataRegistry` + Stage 3 decorators (`@LeryxModule`, `@Entity`, `@Level`, `@Scene`)
- [ ] Root `Injector` + `inject()`
- [ ] `FrameScheduler` + `requestAnimationFrame`
- [ ] Signal flush integrated before Update
- [ ] `UpdatePhase` / `RenderPhase` separation
- [ ] `Canvas2DBackend` — `rect` draw commands
- [ ] Entity lifecycle: `onInit`, `onFixedUpdate`, `onDestroy`
- [ ] `useHook` + `effect()` in `onInit`
- [ ] Keyboard input via `@Injectable` `InputService`
- [ ] Sample: jumping cube (see [framework-syntax.md](framework-syntax.md))
- [ ] Publish `@leryx/core@0.1.0` to npm

### Out of scope

- WebGL, multiplayer, overlays, gamepad, level editor.

### Done when

- `npm run verify` green.
- Demo runs in browser: cube jumps on Space, stable 60fps on mid-tier laptop.
- Internal docs match implemented API (no major drift).

---

## Milestone 2 — Alpha

**Goal:** Playable small 2D prototype with real input and physics hooks.

### Deliverables

- [ ] Fixed timestep accumulator (configurable Hz)
- [ ] `onUpdate` + `onFixedUpdate` contract enforced in scheduler
- [ ] `LevelManager` — load/unload `@Level`, lifecycle `onLoad` / `onUnload`
- [ ] Pointer / touch normalized in `InputService`
- [ ] `math/aabb` + simple AABB collision resolver (no external physics engine)
- [ ] Plugin-ready physics API surface (interfaces for future `@leryx/physics`)
- [ ] `@Item` decorator + collect handler
- [ ] Unit tests: scheduler ordering, DI tree, dirty render set
- [ ] `@leryx/core@0.3.0`

### Done when

- Second demo: cube collects coins, level transition works.
- Test coverage for runtime critical paths (>70% lines in `runtime/`).

---

## Milestone 3 — Beta

**Goal:** Production-oriented rendering and debug tooling.

### Deliverables

- [ ] `WebGLBackend` implementing same `DrawCommand` buffer
- [ ] Sprite batching + texture atlas stub
- [ ] Asset loader service (images, JSON spritesheets)
- [ ] `Matrix3` / camera2d in `math/`
- [ ] `@leryx/overlays` plugin PoC — FPS graph, entity bounds
- [ ] Performance budget doc (max draw calls, signal flush cost)
- [ ] `@leryx/core@0.7.0`, `@leryx/overlays@0.1.0`

### Done when

- Same jumping-cube demo runs on Canvas2D and WebGL backends via config flag.
- Overlays attach without modifying game module code (DI token registration).

---

## Milestone 4 — Release 1.0

**Goal:** Stable API, contributor-ready repo, minimal ecosystem.

### Deliverables

- [ ] Semver-stable public API for `@leryx/core`
- [ ] User documentation in `docs/` (getting started, API reference)
- [ ] `@leryx/server` plugin — transport-agnostic net sync **stub** + sample host/client loop
- [ ] DevTools: scene graph inspector (overlays + core hooks)
- [ ] CI publish green for all packages
- [ ] Migration guide from 0.7 → 1.0
- [ ] `@leryx/core@1.0.0`

### Done when

- npm downloads install without peer dep warnings for documented stack.
- CHANGELOG for 1.0.0 complete.
- Two external contributors can fix a labeled “good first issue” using only `docs/internals/`.

---

## Post-1.0 — Reference game: Infinite Blade Dao

**Goal:** End-to-end showcase game built on stable `@leryx/core` — validates the public API beyond milestone demos.

| Field            | Value                                                                        |
| ---------------- | ---------------------------------------------------------------------------- |
| **Title**        | Infinite Blade Dao                                                           |
| **Path**         | `games/infinite-blade-dao/`                                                  |
| **Game roadmap** | [games/infinite-blade-dao/roadmap.md](../../games/infinite-blade-dao/roadmap.md) |
| **Genre**        | Top-down survivor / horde (Brotato-like)                                     |
| **Setting**      | Chinese manhua / xianxia: cultivation, flying swords, qi, inner power        |
| **Start**        | After `@leryx/core@1.0.0` (M4)                                               |
| **Current**      | G0 — design stub                                                             |

### Deliverables

- [ ] Playable web build on `@leryx/core`
- [ ] Full survivor loop (waves → upgrade choice → stat progression)
- [ ] Smoke test run (5–10 min); featured in user docs

See [games/infinite-blade-dao/roadmap.md](../../games/infinite-blade-dao/roadmap.md) for phases G0–G4.

### Out of scope (v1)

- Multiplayer, procedural maps, full balance pass, localization.

### Done when

- Game runs from monorepo via a single dev command.
- Demonstrates key 1.0 features without deep imports into core.
- Mentioned in user getting-started guide.

---

## Post-1.0 — Demo launcher (GitHub Pages)

**Goal:** Public GitHub Pages site — a “launcher” / library of interactive Leryx.js demos. Users open the site, browse game/demo cards, and play in the browser without a local build.

**Status:** Vision only — not implemented until post-M4.

```mermaid
flowchart TB
  subgraph ghPages [GitHub Pages]
    Launcher[Demo Launcher UI]
    Launcher --> IBD[Infinite Blade Dao]
    Launcher --> CubeDemo[Jumping Cube]
    Launcher --> FutureDemo[Future demos...]
  end
  subgraph ci [CI on release/tag]
    Build[Build static bundles per game]
    Deploy[Deploy to gh-pages branch]
  end
  Build --> Deploy --> ghPages
```

### Planned deliverables

- [ ] Static site shell — grid/list of cards: title, screenshot, description, “Play” button
- [ ] CI workflow: build `games/*` + milestone demos → deploy to GitHub Pages
- [ ] Infinite Blade Dao as flagship launcher entry
- [ ] Milestone demos from M1–M3 (jumping cube, coin collector) as separate cards over time

**Likely location (TBD):** `apps/demo-launcher/` or `sites/playground/` — folder not created yet.

### Out of scope (v1 launcher)

- Accounts, cloud saves, embed SDK for third-party repos.

### Done when

- `https://<org>.github.io/leryx/` (or custom domain) opens the launcher.
- At least 2 playable demos from the monorepo.
- Linked from root README and user docs.

**Dependency:** stable `@leryx/core@1.0.0` + at least one full game build (Infinite Blade Dao G2+).

---

## Package release matrix

| Package           | M1  | M2  | M3  | M4  |
| ----------------- | --- | --- | --- | --- |
| `@leryx/core`     | 0.1 | 0.3 | 0.7 | 1.0 |
| `@leryx/overlays` | —   | —   | 0.1 | 0.3 |
| `@leryx/server`   | —   | —   | —   | 0.1 |

---

## Risks & mitigations

| Risk                                          | Mitigation                                             |
| --------------------------------------------- | ------------------------------------------------------ |
| Stage 3 decorator breakage across TS versions | Pin minimum TS in peer docs; CI matrix on TS 5.2 / 5.9 |
| Signal flush cost per frame                   | `scheduleEffect` batching; benchmark in M3             |
| WebGL scope creep                             | Same command buffer as Canvas2D                        |
| Workspace publish misconfiguration            | Automated tag/version check in `publish.yml`           |

---

## Current status (repository bootstrap)

- Monorepo scaffold + npm workspaces: **done**
- Internal documentation: **done**
- Runtime implementation: **not started** (stubs throw / export version only)

Next engineering task: **Milestone 1 — PoC** starting with `FrameScheduler` and metadata registry.
