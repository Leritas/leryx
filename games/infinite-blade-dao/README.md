# Infinite Blade Dao

**Cultivation survivor on Leryx.js** — a reference game showcasing the engine after v1.0.

Development phases: [roadmap.md](roadmap.md).

**Status:** G0 — design stub (no game code yet).

## Elevator pitch

A young cultivator enters a sect trial arena. Demonic beasts and spiritual predators spawn in tribulation-like waves. Your flying swords orbit and strike automatically while you dodge and channel qi. Between waves, choose a technique or artifact to grow stronger — until the heavens demand everything you have.

## Setting

Chinese manhua / xianxia tone:

- **Cultivation** — qi (气), inner power (内功), breakthrough pressure
- **Combat** — flying swords (飞剑), talismans, qi bursts
- **Threats** — demons, corrupted beasts, trial spawns themed as heavenly tribulation (天劫)
- **Progression** — techniques (功法) and sect artifacts, not modern loot tiers

## Core loop

Mapped from Brotato-style survivor gameplay:

| Brotato            | Infinite Blade Dao                                           |
| ------------------ | ------------------------------------------------------------ |
| Potato character   | Cultivator (single starter character)                        |
| Weapons            | Flying swords, qi techniques, talismans                      |
| Waves              | Demon / tribulation spawns                                   |
| Shop between waves | Pick one of three techniques or artifacts                    |
| Stats              | Qi, inner power, move speed, sword count, pierce             |

## Planned entities

- `Cultivator` — player, movement, stats, death
- `FlyingSword` — orbiting auto-attack weapon
- `WaveSpawner` — escalating wave director
- `Demon` — baseline melee chaser
- `QiOrb` — optional pickup / resource drop

## Engine dependencies

| Game need              | Engine milestone                          |
| ---------------------- | ----------------------------------------- |
| Loop, DI, decorators   | M1                                        |
| Collision, `@Item`     | M2                                        |
| Sprites, asset loader  | M3                                        |
| Stable API, overlays   | M4                                        |

Implementation starts after **M4** (`@leryx/core@1.0.0`). See [roadmap.md](roadmap.md) for G1–G4.
