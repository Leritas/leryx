import { compileModule } from './di/module-compiler.js';
import { Injector } from './di/injector.js';
import { runInInjectionContext } from './di/injection-context.js';
import { LeryxMetadataRegistry } from './di/metadata-registry.js';
import type { InjectionToken } from './di/tokens.js';
import { Canvas2DBackend } from './renderer/canvas2d-backend.js';
import { createSceneInstance } from './scene/level-manager.js';
import { LevelManager } from './scene/level-manager.js';
import { SceneGraph } from './scene/scene-graph.js';
import { FrameScheduler } from './runtime/frame-scheduler.js';
import { callLifecycleHook } from './runtime/lifecycle.js';

export interface BootstrapLeryxOptions {
    /** Root game module class decorated with @LeryxModule */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    module: new (...args: any[]) => unknown;
    /** Canvas element or CSS selector */
    canvas: HTMLCanvasElement | string;
    /** Level path to load on startup (defaults to "main") */
    entryLevel?: string;
}

export interface BootstrapLeryxResult {
    destroy(): void;
}

function resolveCanvas(canvas: HTMLCanvasElement | string): HTMLCanvasElement {
    if (typeof canvas !== 'string') {
        return canvas;
    }

    const element = document.querySelector(canvas);
    if (!(element instanceof HTMLCanvasElement)) {
        throw new Error(`@leryx/core: Canvas element not found for selector "${canvas}".`);
    }
    return element;
}

export function bootstrapLeryx(options: BootstrapLeryxOptions): BootstrapLeryxResult {
    const canvas = resolveCanvas(options.canvas);
    const compiledModule = compileModule(options.module as InjectionToken);
    const rootInjector = new Injector(compiledModule.providers);
    const sceneGraph = new SceneGraph();

    let scheduler: FrameScheduler | null = null;

    const markDirty = (entityId: string): void => {
        scheduler?.markDirty(entityId);
    };

    const levelManager = new LevelManager(compiledModule, rootInjector, sceneGraph, markDirty);

    if (!compiledModule.sceneClass) {
        throw new Error('@leryx/core: Game module must declare exactly one @Scene class.');
    }

    const sceneInstance = createSceneInstance(compiledModule.sceneClass);
    runInInjectionContext(rootInjector, () => {
        callLifecycleHook(sceneInstance, 'onInit');
    });

    const entryLevel =
        options.entryLevel ??
        LeryxMetadataRegistry.getScene(compiledModule.sceneClass)?.entryLevel ??
        'main';

    levelManager.loadEntryLevel(entryLevel);

    const backend = new Canvas2DBackend(canvas);
    scheduler = new FrameScheduler({
        backend,
        getEntities: () => sceneGraph.getEntities(),
        viewport: {
            width: canvas.width,
            height: canvas.height,
        },
    });

    scheduler.start();

    return {
        destroy(): void {
            scheduler?.stop();
            levelManager.destroy();
        },
    };
}
