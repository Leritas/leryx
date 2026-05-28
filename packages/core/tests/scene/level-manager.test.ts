import { describe, expect, it, vi } from 'vitest';
import { LeryxMetadataRegistry } from '../../src/di/metadata-registry.js';
import { compileModule } from '../../src/di/module-compiler.js';
import { Injector } from '../../src/di/injector.js';
import { LevelManager } from '../../src/scene/level-manager.js';
import { SceneGraph } from '../../src/scene/scene-graph.js';

const mainLevels: MainLevel[] = [];
const completeLevels: CompleteLevel[] = [];

class MainLevel {
    readonly hooks: string[] = [];

    constructor() {
        mainLevels.push(this);
    }

    onLoad(): void {
        this.hooks.push('main:onLoad');
    }

    onActivate(): void {
        this.hooks.push('main:onActivate');
    }

    onUnload(): void {
        this.hooks.push('main:onUnload');
    }
}

class CompleteLevel {
    readonly hooks: string[] = [];

    constructor() {
        completeLevels.push(this);
    }

    onLoad(): void {
        this.hooks.push('complete:onLoad');
    }

    onActivate(): void {
        this.hooks.push('complete:onActivate');
    }

    onUnload(): void {
        this.hooks.push('complete:onUnload');
    }
}

class MainPlayer {
    onInit(): void {}
}

class CompleteBanner {}

class CoinItem {
    onInit(): void {}
}

class TestModule {}

describe('LevelManager', () => {
    it('loads only entities for the active level and transitions cleanly', () => {
        mainLevels.length = 0;
        completeLevels.length = 0;

        LeryxMetadataRegistry.setLevel(MainLevel, { path: 'main' });
        LeryxMetadataRegistry.setLevel(CompleteLevel, { path: 'complete' });
        LeryxMetadataRegistry.setEntity(MainPlayer, {
            selector: 'player',
            level: 'main',
            role: 'player',
        });
        LeryxMetadataRegistry.setEntity(CompleteBanner, { selector: 'banner', level: 'complete' });
        LeryxMetadataRegistry.setItem(CoinItem, { kind: 'coin', level: 'main' });
        LeryxMetadataRegistry.setEntity(CoinItem, { selector: 'coin', level: 'main' });
        LeryxMetadataRegistry.setModule(TestModule, {
            declarations: [MainLevel, CompleteLevel, MainPlayer, CompleteBanner, CoinItem],
        });

        const compiled = compileModule(TestModule);
        const injector = new Injector(compiled.providers);
        const sceneGraph = new SceneGraph();
        const onDirty = vi.fn();
        const manager = new LevelManager(compiled, injector, sceneGraph, onDirty);

        manager.loadLevel('main');
        expect(sceneGraph.getEntities()).toHaveLength(2);
        expect(sceneGraph.getEntities().map((entity) => entity.selector)).toEqual([
            'player',
            'coin',
        ]);
        expect(mainLevels[0]?.hooks).toEqual(['main:onLoad', 'main:onActivate']);

        manager.loadLevel('complete');
        expect(sceneGraph.getEntities()).toHaveLength(1);
        expect(sceneGraph.getEntities()[0]?.selector).toBe('banner');
        expect(manager.getActivePath()).toBe('complete');
        expect(mainLevels[0]?.hooks).toEqual(['main:onLoad', 'main:onActivate', 'main:onUnload']);
        expect(completeLevels[0]?.hooks).toEqual(['complete:onLoad', 'complete:onActivate']);
    });
});
