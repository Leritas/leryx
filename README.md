# Leryx.js

Declarative 2D game framework for the web — Angular-style modules & DI, Preact signals reactivity, Canvas/WebGL rendering.

> **Status:** architecture & internal docs; runtime implementation starts at Milestone 1 (PoC).

## Monorepo packages

| Package           | Path                                   | Description              |
| ----------------- | -------------------------------------- | ------------------------ |
| `@leryx/core`     | [`packages/core`](packages/core)       | Engine core              |
| `@leryx/server`   | [`plugins/server`](plugins/server)     | Networking (stub)        |
| `@leryx/overlays` | [`plugins/overlays`](plugins/overlays) | DevTools overlays (stub) |

## Documentation

- **Contributors:** [`docs/internals/`](docs/internals/)
- **Users (coming soon):** [`docs/`](docs/)

## Development

```bash
npm install
npm run verify    # typecheck, build, test, lint, format
npm run build     # @leryx/core only
npm run build:all # all workspaces
```

## License

MIT — see [LICENSE](LICENSE).
