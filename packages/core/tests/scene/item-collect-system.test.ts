import { describe, expect, it, vi } from 'vitest';
import { LeryxMetadataRegistry } from '../../src/di/metadata-registry.js';
import { ItemCollectSystem } from '../../src/scene/item-collect-system.js';
import { SceneGraph } from '../../src/scene/scene-graph.js';
import { Injector } from '../../src/di/injector.js';

class Player {
    readonly posX = 10;
    readonly posY = 10;
    get renderDescriptor() {
        return {
            type: 'rect' as const,
            x: this.posX,
            y: this.posY,
            width: 20,
            height: 20,
            fill: '#fff',
        };
    }
}

class Coin {
    collected = false;
    onCollect(): void {
        this.collected = true;
    }
    get renderDescriptor() {
        return {
            type: 'rect' as const,
            x: 15,
            y: 15,
            width: 10,
            height: 10,
            fill: '#ff0',
        };
    }
}

describe('ItemCollectSystem', () => {
    it('collects overlapping items and removes them from the scene graph', () => {
        LeryxMetadataRegistry.setEntity(Player, { selector: 'player-cube', role: 'player' });
        LeryxMetadataRegistry.setItem(Coin, { kind: 'coin' });
        LeryxMetadataRegistry.setEntity(Coin, { selector: 'coin' });

        const sceneGraph = new SceneGraph();
        const onDirty = vi.fn();
        const injector = new Injector([]);
        const playerHost = sceneGraph.spawnEntity(Player, injector, onDirty);
        const coinHost = sceneGraph.spawnEntity(Coin, injector, onDirty);
        playerHost.start();
        coinHost.start();

        const system = new ItemCollectSystem(sceneGraph);
        system.update(sceneGraph.getEntities(), onDirty);

        expect((coinHost.instance as Coin).collected).toBe(true);
        expect(sceneGraph.getEntities()).toHaveLength(1);
        expect(sceneGraph.getEntities()[0]?.id).toBe(playerHost.id);
        expect(onDirty).toHaveBeenCalledWith(playerHost.id);
    });
});
