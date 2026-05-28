# @leryx/core

**Leryx.js** engine core — declarative 2D games for the browser with Angular-style modules & DI, [Preact signals](https://github.com/preactjs/signals) reactivity, and a Canvas2D render pipeline.

**Status:** `0.3.x` — Milestone 2 (Alpha). Fixed timestep, core `InputService`, AABB physics hooks, level transitions, `@Item` collection. Demos: `demos/jumping-cube/` (M1), `demos/coin-collector/` (M2).

## Install

```bash
npm install @leryx/core @preact/signals-core
```

`@preact/signals-core` is a **peer dependency** — install it in your app.

## Requirements

- TypeScript **≥ 5.2**
- Stage 3 decorators enabled (`experimentalDecorators: false` in `tsconfig`)

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "experimentalDecorators": false
    }
}
```

## Quick start

**`index.html`**

```html
<canvas id="game" width="640" height="360"></canvas>
<script type="module" src="/main.js"></script>
```

**`main.ts`**

```typescript
import { bootstrapLeryx } from '@leryx/core';
import { GameModule } from './game.module.js';

bootstrapLeryx({ module: GameModule, canvas: '#game' });
```

**`game.module.ts`**

```typescript
import { LeryxModule } from '@leryx/core';
import { GameScene } from './game.scene.js';
import { MainLevel } from './levels/main.level.js';
import { PlayerCube } from './entities/player-cube.entity.js';
import { Ground } from './entities/ground.entity.js';

@LeryxModule({
    declarations: [GameScene, MainLevel, PlayerCube, Ground],
})
export class GameModule {}
```

**`entities/player-cube.entity.ts`** (minimal)

```typescript
import { Entity } from '@leryx/core';
import { signal } from '@leryx/core/reactivity';

@Entity({ selector: 'player-cube' })
export class PlayerCube {
    readonly posY = signal(300);

    get renderDescriptor() {
        return {
            type: 'rect' as const,
            x: 100,
            y: this.posY.value,
            width: 40,
            height: 40,
            fill: '#4a90d9',
        };
    }
}
```

Entities expose visual state via `renderDescriptor` (or static `transform` / `fill` fields). The engine emits draw commands — you do not call `ctx.fillRect` in gameplay code.

## Public API

| Import                   | Contents                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `@leryx/core`            | `@LeryxModule`, `@Scene`, `@Level`, `@Entity`, `@Item`, `@Injectable`, `bootstrapLeryx`, `inject`, `useHook` |
| `@leryx/core/reactivity` | `signal`, `computed`, `effect`, `batch`, `scheduleEffect`                                                    |

### Entity lifecycle

| Hook                | When                                            |
| ------------------- | ----------------------------------------------- |
| `onInit`            | Setup; use `inject()` and `useHook()` here only |
| `onStart`           | Before the first update tick                    |
| `onFixedUpdate(dt)` | Fixed step (1/60 s per frame in 0.1.x)          |
| `onUpdate(dt)`      | Variable frame step                             |
| `onDestroy`         | Teardown                                        |

### Game loop (per frame)

1. Signal / scheduled effect flush
2. `onFixedUpdate`
3. `onUpdate`
4. Render (Canvas2D draw commands)

## Example project

Full demos in the monorepo:

| Demo           | Command              | Milestone |
| -------------- | -------------------- | --------- |
| Jumping cube   | `npm run demo`       | M1 PoC    |
| Coin collector | `npm run demo:coins` | M2 Alpha  |

```bash
git clone https://github.com/Leritas/leryx.git
cd leryx
npm install
npm run demo
npm run demo:coins
```

## Repository & docs

- Monorepo: [github.com/Leritas/leryx](https://github.com/Leritas/leryx)
- Contributor / architecture docs: [`docs/internals/`](https://github.com/Leritas/leryx/tree/main/docs/internals)

## Related packages

| Package           | Status     |
| ----------------- | ---------- |
| `@leryx/server`   | Stub (M4)  |
| `@leryx/overlays` | Stub (M3+) |

## License

MIT
