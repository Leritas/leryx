import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import type { Plugin, UserConfig } from 'vite';

const DECORATOR_PATTERN = /@[A-Za-z_$][\w$]*\s*(\(|class)/;

function leryxDecoratorTransformPlugin(): Plugin {
    return {
        name: 'leryx-decorator-transform',
        enforce: 'pre',
        async transform(code, id) {
            if (!id.endsWith('.ts') && !id.endsWith('.tsx')) {
                return null;
            }

            if (id.includes('node_modules')) {
                return null;
            }

            if (!DECORATOR_PATTERN.test(code)) {
                return null;
            }

            const result = await esbuild.transform(code, {
                loader: id.endsWith('.tsx') ? 'tsx' : 'ts',
                format: 'esm',
                target: 'es2022',
                sourcemap: true,
                sourcefile: id,
                tsconfigRaw: {
                    compilerOptions: {
                        experimentalDecorators: false,
                        useDefineForClassFields: true,
                    },
                },
            });

            return {
                code: result.code,
                map: result.map,
            };
        },
    };
}

export function createDemoViteConfig(importMetaUrl: string): UserConfig {
    const root = path.dirname(fileURLToPath(importMetaUrl));

    return {
        root,
        plugins: [leryxDecoratorTransformPlugin()],
        esbuild: {
            tsconfigRaw: {
                compilerOptions: {
                    experimentalDecorators: false,
                    useDefineForClassFields: true,
                },
            },
        },
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
    };
}
