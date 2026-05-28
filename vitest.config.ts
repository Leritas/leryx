import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    root,
    test: {
        environment: 'jsdom',
        include: ['packages/core/tests/**/*.test.ts', 'plugins/**/tests/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            include: ['packages/core/src/runtime/**'],
            thresholds: {
                lines: 70,
            },
        },
    },
    resolve: {
        alias: {
            '@leryx/core': path.join(root, 'packages/core/src/index.ts'),
            '@leryx/core/reactivity': path.join(root, 'packages/core/src/reactivity/index.ts'),
            '@leryx/server': path.join(root, 'plugins/server/src/index.ts'),
            '@leryx/overlays': path.join(root, 'plugins/overlays/src/index.ts'),
        },
    },
});
