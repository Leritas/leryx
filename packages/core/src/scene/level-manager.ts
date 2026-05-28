import { LeryxMetadataRegistry } from '../di/metadata-registry.js';
import type { Injector } from '../di/injector.js';
import type { CompiledModule, InjectionToken } from '../di/tokens.js';
import { callLifecycleHook } from '../runtime/lifecycle.js';
import type { LevelLifecycle } from '../runtime/lifecycle.js';
import type { SceneLifecycle } from '../runtime/lifecycle.js';
import { SceneGraph } from './scene-graph.js';

export class LevelManager {
    private activeLevel: LevelLifecycle | null = null;

    constructor(
        private readonly compiledModule: CompiledModule,
        private readonly rootInjector: Injector,
        private readonly sceneGraph: SceneGraph,
        private readonly onDirty: (entityId: string) => void,
    ) {}

    loadEntryLevel(entryPath = 'main'): void {
        const levelToken = this.resolveLevelToken(entryPath);
        this.loadLevel(levelToken);
    }

    unloadActiveLevel(): void {
        if (this.activeLevel) {
            callLifecycleHook(this.activeLevel, 'onUnload');
        }
        this.sceneGraph.destroyAll();
        this.activeLevel = null;
    }

    destroy(): void {
        this.unloadActiveLevel();
    }

    private resolveLevelToken(entryPath: string): InjectionToken {
        const levels = this.compiledModule.levelClasses;
        if (levels.length === 0) {
            throw new Error('@leryx/core: No @Level declarations found in the game module.');
        }

        const matched = levels.find(
            (token) => LeryxMetadataRegistry.getLevel(token)?.path === entryPath,
        );
        return matched ?? levels[0]!;
    }

    private loadLevel(levelToken: InjectionToken): void {
        this.unloadActiveLevel();

        const levelInjector = this.rootInjector.createChild();
        const levelInstance = new levelToken() as LevelLifecycle;
        this.activeLevel = levelInstance;

        callLifecycleHook(levelInstance, 'onLoad');

        for (const entityToken of this.compiledModule.entityClasses) {
            this.sceneGraph.spawnEntity(entityToken, levelInjector, this.onDirty);
        }

        this.sceneGraph.startAll();
        callLifecycleHook(levelInstance, 'onActivate');
    }
}

export function createSceneInstance(sceneClass: InjectionToken): SceneLifecycle {
    return new sceneClass() as SceneLifecycle;
}
