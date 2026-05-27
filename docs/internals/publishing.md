# Publishing `@leryx/*` packages

This monorepo uses **npm workspaces** with **one package per git tag** (same pattern as [svg-shards](https://github.com/Leritas/svg-shards), adapted for workspaces).

## Packages

| npm name          | Workspace path     | Git tag prefix | Example tag       |
| ----------------- | ------------------ | -------------- | ----------------- |
| `@leryx/core`     | `packages/core`    | `v`            | `v0.1.0`          |
| `@leryx/server`   | `plugins/server`   | `server-v`     | `server-v0.1.0`   |
| `@leryx/overlays` | `plugins/overlays` | `overlays-v`   | `overlays-v0.1.0` |

## Prerequisites

1. npm Trusted Publishing (OIDC) configured for each package on [npmjs.com](https://www.npmjs.com/).
2. GitHub Actions workflow [`.github/workflows/publish.yml`](../../.github/workflows/publish.yml) enabled on the default branch.
3. Version in the target `package.json` matches the tag suffix (CI verifies this on tag push).

## Local checks before release

```bash
npm ci
npm run verify
npm run build -w @leryx/core    # or the package you publish
```

## Release via git tag (recommended)

```bash
# @leryx/core
cd packages/core && npm version patch   # or edit version manually
git add packages/core/package.json
git commit -m "chore(core): release 0.1.0"
git tag v0.1.0
git push origin main --tags

# @leryx/server (depends on published @leryx/core peer range)
# bump plugins/server/package.json, peerDependencies @leryx/core
git tag server-v0.1.0
git push origin server-v0.1.0
```

Tag push triggers `publish.yml`: resolve job → build → `npm publish -w <workspace> --access public`.

## Manual publish (workflow_dispatch)

1. GitHub → Actions → **Publish** → Run workflow.
2. Select package: `core` | `server` | `overlays`.
3. Skips tag/version verification (`verify-tag=false`).

## Workspace dependency rules

**Inside the monorepo** (`plugins/*/package.json`):

```json
{
    "dependencies": {
        "@leryx/core": "0.0.1"
    },
    "peerDependencies": {
        "@leryx/core": "^0.1.0"
    }
}
```

- With **npm workspaces**, matching semver (`0.0.1`) resolves to the local `packages/core` package (symlink).
- On `npm publish`, npm replaces the local version with the published semver from the registry.
- Optional: npm 11+ also supports `"workspace:*"` protocol; this repo uses explicit versions for broader npm 10 compatibility.

**Rule:** when releasing `@leryx/core` with breaking changes, bump plugin `peerDependencies` ranges and release plugins after core.

## Adding a new publishable package

1. Add `plugins/<name>/package.json` with `"name": "@leryx/<name>"`.
2. Ensure root `workspaces` includes `plugins/*`.
3. Add tag pattern and `case` branch in `publish.yml` `resolve` step.
4. Document the tag prefix in this file.

## Do not

- Publish from package subfolders with `cd plugins/server && npm publish` — use `npm publish -w @leryx/server` from repo root so workspace resolution is correct.
- Use one tag for multiple packages.
- Publish plugins before `@leryx/core` when peer range requires a version not yet on npm.
