# Framework syntax — public API & DX

Leryx.js uses an **Angular-inspired** syntax: **TC39 Stage 3 decorators**, **modules with DI**, and **Preact-compatible signals**. This document defines the intended developer experience (contracts); implementation lands in Milestone 1+.

## Syntax choice

| Approach                               | Decision                                                            |
| -------------------------------------- | ------------------------------------------------------------------- |
| React function components + hooks      | Rejected as primary — harder to align with game entity types and DI |
| Angular classes + decorators + modules | **Selected** — familiar structure, explicit lifecycle               |
| Signals                                | **`@preact/signals-core`** via `@leryx/core/reactivity`             |

TypeScript requirement: **≥ 5.2**, `experimentalDecorators: false`, Stage 3 decorator support enabled in consumer `tsconfig`.

## Core decorators

```typescript
import { LeryxModule, Scene, Level, Entity, Item, Injectable } from '@leryx/core';
```

| Decorator                     | Applies to | Purpose                                          |
| ----------------------------- | ---------- | ------------------------------------------------ |
| `@LeryxModule({...})`         | `class`    | Bundle providers & declarations                  |
| `@Scene()`                    | `class`    | Application root                                 |
| `@Level({ path })`            | `class`    | Loadable level                                   |
| `@Entity({ selector })`       | `class`    | Game object                                      |
| `@Item({ kind })`             | `class`    | Pickup / inventory item (extends entity pattern) |
| `@Injectable({ providedIn })` | `class`    | DI service                                       |

### @LeryxModule

```typescript
@LeryxModule({
    imports: [InputModule],
    providers: [ScoreService],
    declarations: [MainLevel, PlayerCube, Ground],
})
export class GameModule {}
```

### @Scene

```typescript
@Scene()
export class GameScene {
    // Optional: entry level id resolved by LevelManager
}
```

### @Level

```typescript
@Level({ path: 'main' })
export class MainLevel {
    onLoad(): void {
        /* spawn entities */
    }
    onUnload(): void {
        /* teardown */
    }
}
```

### @Entity

```typescript
@Entity({ selector: 'player-cube' })
export class PlayerCube {
    // lifecycle + signals below
}
```

### @Item

```typescript
@Item({ kind: 'coin', stackable: true })
export class CoinItem {
    onCollect(): void {
        /* ... */
    }
}
```

## Dependency injection

```typescript
import { Injectable, inject } from '@leryx/core';

@Injectable({ providedIn: 'root' })
export class InputService {
    readonly jumpPressed = signal(false);

    constructor() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') this.jumpPressed.value = true;
        });
        window.addEventListener('keyup', (e) => {
            if (e.code === 'Space') this.jumpPressed.value = false;
        });
    }
}
```

Inside an entity during `onInit`:

```typescript
const input = inject(InputService);
```

## Reactivity

Import from `@leryx/core/reactivity`:

```typescript
import { signal, computed, effect, batch } from '@leryx/core/reactivity';
import { useHook } from '@leryx/core'; // entity setup only
```

| API                    | Usage                                                         |
| ---------------------- | ------------------------------------------------------------- |
| `signal(initial)`      | Mutable reactive state                                        |
| `computed(fn)`         | Derived read-only value                                       |
| `effect(fn)`           | Run when dependencies change; may mark entity dirty           |
| `batch(fn)`            | Multiple writes → one notification                            |
| `useHook(() => {...})` | Entity `onInit` only — subscriptions, cleanup via returned fn |

`effect()` example on entity:

```typescript
effect(() => {
    // Read signals → side effect (e.g. play sound when grounded changes)
    if (this.isGrounded.value) {
        // ...
    }
});
```

## Lifecycle hooks

### Entity

| Hook                     | When                                                     |
| ------------------------ | -------------------------------------------------------- |
| `onInit`                 | First setup; **only** place for `useHook()` / `inject()` |
| `onStart`                | Before first Update tick                                 |
| `onEnable` / `onDisable` | Active flag toggled                                      |
| `onFixedUpdate(dt)`      | Fixed timestep (physics)                                 |
| `onUpdate(dt)`           | Variable timestep (input edges, animations)              |
| `onDestroy`              | Removed from tree                                        |

### Level

| Hook                   | When                             |
| ---------------------- | -------------------------------- |
| `onLoad`               | Level assets & entities spawning |
| `onActivate`           | Becomes active level             |
| `onPause` / `onResume` | Pause menu                       |
| `onUnload`             | Teardown                         |

**Rule:** never draw in lifecycle hooks — only mutate state / transforms.

## Bootstrap

```typescript
import { bootstrapLeryx } from '@leryx/core';
import { GameModule } from './game.module.js';

bootstrapLeryx({
    module: GameModule,
    canvas: '#game',
});
```

## Full example — “Jumping cube”

Minimal 2D game: a cube falls with gravity, jumps on Space, draws as a colored rect.

### `game.module.ts`

```typescript
import { LeryxModule } from '@leryx/core';
import { MainLevel } from './levels/main.level.js';
import { PlayerCube } from './entities/player-cube.entity.js';
import { Ground } from './entities/ground.entity.js';
import { InputModule } from './input/input.module.js';

@LeryxModule({
    imports: [InputModule],
    declarations: [MainLevel, PlayerCube, Ground],
})
export class GameModule {}
```

### `input/input.module.ts`

```typescript
import { LeryxModule } from '@leryx/core';
import { InputService } from './input.service.js';

@LeryxModule({
    providers: [InputService],
})
export class InputModule {}
```

### `input/input.service.ts`

```typescript
import { Injectable } from '@leryx/core';
import { signal } from '@leryx/core/reactivity';

@Injectable({ providedIn: 'root' })
export class InputService {
    /** Edge-friendly: true only on frames where Space was newly pressed */
    readonly jumpRequested = signal(false);

    constructor() {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') this.jumpRequested.value = true;
        });
    }

    /** Called by scheduler at end of Update to consume edge */
    clearJump(): void {
        this.jumpRequested.value = false;
    }
}
```

### `levels/main.level.ts`

```typescript
import { Level } from '@leryx/core';

@Level({ path: 'main' })
export class MainLevel {
    onLoad(): void {
        // LevelManager spawns declarations from module metadata
    }
}
```

### `entities/ground.entity.ts`

```typescript
import { Entity } from '@leryx/core';

@Entity({ selector: 'ground' })
export class Ground {
    // Visual metadata (conceptual — wired by engine from decorators / defaults)
    readonly transform = { x: 0, y: 340, width: 640, height: 20 };
    readonly fill = '#333333';
}
```

### `entities/player-cube.entity.ts`

```typescript
import { Entity, inject } from '@leryx/core';
import { signal, effect } from '@leryx/core/reactivity';
import { InputService } from '../input/input.service.js';

const GRAVITY = 1200;
const JUMP_VELOCITY = -420;
const GROUND_Y = 320;
const CUBE_SIZE = 40;

@Entity({ selector: 'player-cube' })
export class PlayerCube {
    private readonly input = inject(InputService);

    /** Vertical velocity (px/s) */
    readonly velocityY = signal(0);

    /** Position (px) */
    readonly posY = signal(GROUND_Y);

    /** Derived grounded flag for effects */
    readonly isGrounded = signal(true);

    onInit(): void {
        // useHook: react to jump input without polling in onUpdate
        useHook(() => {
            return effect(() => {
                if (this.input.jumpRequested.value && this.isGrounded.value) {
                    this.velocityY.value = JUMP_VELOCITY;
                    this.isGrounded.value = false;
                }
            });
        });

        // Visual feedback when landing
        useHook(() => {
            return effect(() => {
                if (this.isGrounded.value) {
                    // e.g. trigger squash animation signal (omitted in PoC)
                }
            });
        });
    }

    onFixedUpdate(dt: number): void {
        // Physics in fixed step — deterministic
        let vy = this.velocityY.value;
        let y = this.posY.value;

        vy += GRAVITY * dt;
        y += vy * dt;

        if (y >= GROUND_Y) {
            y = GROUND_Y;
            vy = 0;
            this.isGrounded.value = true;
        } else {
            this.isGrounded.value = false;
        }

        this.velocityY.value = vy;
        this.posY.value = y;
    }

    onUpdate(_dt: number): void {
        // Consume input edge once per frame
        this.input.clearJump();
    }

    // Render metadata read by RenderPhase (not imperative draw)
    get renderDescriptor() {
        return {
            type: 'rect' as const,
            x: 100,
            y: this.posY.value,
            width: CUBE_SIZE,
            height: CUBE_SIZE,
            fill: this.isGrounded.value ? '#4a90d9' : '#6ab0f9',
        };
    }
}
```

### `main.ts`

```typescript
import { bootstrapLeryx } from '@leryx/core';
import { GameModule } from './game.module.js';

bootstrapLeryx({
    module: GameModule,
    canvas: '#game',
});
```

### `index.html` (host page)

```html
<canvas id="game" width="640" height="360"></canvas>
<script type="module" src="/main.js"></script>
```

## What the engine does with this code

1. **Bootstrap** builds injector from `GameModule`, mounts `GameScene`, loads `@Level({ path: 'main' })`.
2. **Entity hosts** instantiate `PlayerCube` / `Ground`, call `onInit` → register `useHook` cleanups.
3. Each frame: flush **effects** → **onFixedUpdate** (gravity) → **onUpdate** (clear jump) → **RenderPhase** reads `renderDescriptor` / component metadata → issues `DrawCommand`s.
4. **Canvas2DBackend** draws rects — no `fillRect` in user code.

## Anti-patterns

| Don't                          | Do instead                                         |
| ------------------------------ | -------------------------------------------------- |
| `ctx.fillRect` in entity       | Expose visual state; let RenderPhase emit commands |
| Global `let playerY`           | `signal()` on entity                               |
| `inject()` in `onUpdate`       | `inject()` in `onInit` only                        |
| `useHook` outside entity setup | Only in `onInit`                                   |
| Heavy work in `effect()`       | Keep effects thin; physics in `onFixedUpdate`      |

## Public export map (target)

| Import path              | Contents                                                  |
| ------------------------ | --------------------------------------------------------- |
| `@leryx/core`            | Decorators, bootstrap, inject, lifecycle types, `useHook` |
| `@leryx/core/reactivity` | `signal`, `computed`, `effect`, `batch`, `scheduleEffect` |

See [core-architecture.md](core-architecture.md) for runtime behavior behind this syntax.
