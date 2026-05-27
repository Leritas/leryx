# Leryx.js plugins

Optional packages published under the `@leryx/*` scope. Each plugin is an npm workspace under `plugins/<name>/`.

## Adding a new plugin

1. Create `plugins/<name>/` with `package.json` (`name`: `@leryx/<name>`).
2. Add `"@leryx/core": "<current-core-version>"` in `dependencies` and semver range in `peerDependencies`.
3. Ensure root `package.json` `workspaces` includes `plugins/*` (already configured).
4. Update [`.github/workflows/publish.yml`](../.github/workflows/publish.yml) resolve map and tag pattern.
5. Document in [`docs/internals/publishing.md`](../docs/internals/publishing.md).

## Existing plugins

| Package           | Status               |
| ----------------- | -------------------- |
| `@leryx/server`   | Stub — Milestone 4   |
| `@leryx/overlays` | Stub — Milestone 3–4 |
