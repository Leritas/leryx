import { LeryxMetadataRegistry } from '../di/metadata-registry.js';
import type { Injector } from '../di/injector.js';
import type { CompiledModule, InjectionToken } from '../di/tokens.js';
import { callLifecycleHook } from '../runtime/lifecycle.js';
import type { LevelLifecycle } from '../runtime/lifecycle.js';
import type { SceneLifecycle } from '../runtime/lifecycle.js';
import { SceneGraph } from './scene-graph.js';

function belongsToLevel(token: InjectionToken, levelPath: string): boolean {
    const entityMeta = LeryxMetadataRegistry.getEntity(token);
    const itemMeta = LeryxMetadataRegistry.getItem(token);
    const level = entityMeta?.level ?? itemMeta?.level;
    return level === undefined || level === levelPath;
}

export class LevelManager {
    private activeLevel: LevelLifecycle | null = null;
    private activeLevelPath: string | null = null;

    constructor(
        private readonly compiledModule: CompiledModule,
        private readonly rootInjector: Injector,
        private readonly sceneGraph: SceneGraph,
        private readonly onDirty: (entityId: string) => void,
    ) {}

    loadEntryLevel(entryPath = 'main'): void {
        this.loadLevel(entryPath);
    }

    loadLevel(entryPath: string): void {
        const levelToken = this.resolveLevelToken(entryPath);
        this.loadLevelToken(levelToken, entryPath);
    }

    getActivePath(): string | null {
        return this.activeLevelPath;
    }

    unloadActiveLevel(): void {
        if (this.activeLevel) {
            callLifecycleHook(this.activeLevel, 'onUnload');
        }
        this.sceneGraph.destroyAll();
        this.activeLevel = null;
        this.activeLevelPath = null;
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
        if (!matched) {
            throw new Error(`@leryx/core: No @Level found for path "${entryPath}".`);
        }
        return matched;
    }

    private loadLevelToken(levelToken: InjectionToken, levelPath: string): void {
        this.unloadActiveLevel();

        const levelInjector = this.rootInjector.createChild();
        const levelInstance = new levelToken() as LevelLifecycle;
        this.activeLevel = levelInstance;
        this.activeLevelPath = levelPath;

        callLifecycleHook(levelInstance, 'onLoad');

        const spawnTokens = [
            ...this.compiledModule.entityClasses,
            ...this.compiledModule.itemClasses,
        ].filter((token) => belongsToLevel(token, levelPath));

        for (const spawnToken of spawnTokens) {
            this.sceneGraph.spawnEntity(spawnToken, levelInjector, this.onDirty);
        }

        this.sceneGraph.startAll();
        callLifecycleHook(levelInstance, 'onActivate');
    }
}

export function createSceneInstance(sceneClass: InjectionToken): SceneLifecycle {
    return new sceneClass() as SceneLifecycle;
}
