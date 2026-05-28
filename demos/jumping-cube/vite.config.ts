import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    root,
    resolve: {
        alias: [
            {
                find: '@leryx/core/reactivity',
                replacement: path.join(root, '../../packages/core/src/reactivity/index.ts'),
            },
            {
                find: '@leryx/core',
                replacement: path.join(root, '../../packages/core/src/index.ts'),
            },
        ],
    },
});
