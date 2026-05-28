import { describe, expect, it, vi } from 'vitest';
import { bootstrapLeryx, LeryxMetadataRegistry } from '@leryx/core';
import { InputModule } from '../../src/input/input.module.js';

class GameScene {}
class MainLevel {}
class Ground {
    readonly transform = { x: 0, y: 340, width: 640, height: 20 };
    readonly fill = '#333333';
}
class PlayerCube {
    readonly renderDescriptor = {
        type: 'rect' as const,
        x: 100,
        y: 300,
        width: 40,
        height: 40,
        fill: '#4a90d9',
    };
}
class CoinOne {
    readonly renderDescriptor = {
        type: 'rect' as const,
        x: 180,
        y: 280,
        width: 16,
        height: 16,
        fill: '#f5c542',
    };
}
class GameModule {}

describe('coin-collector render bootstrap', () => {
    it('draws spawned entities on the first animation frame', async () => {
        LeryxMetadataRegistry.setScene(GameScene, { entryLevel: 'main' });
        LeryxMetadataRegistry.setLevel(MainLevel, { path: 'main' });
        LeryxMetadataRegistry.setEntity(Ground, { selector: 'ground', level: 'main' });
        LeryxMetadataRegistry.setEntity(PlayerCube, {
            selector: 'player-cube',
            level: 'main',
            role: 'player',
        });
        LeryxMetadataRegistry.setItem(CoinOne, { kind: 'coin', level: 'main' });
        LeryxMetadataRegistry.setModule(GameModule, {
            imports: [InputModule],
            declarations: [GameScene, MainLevel, Ground, PlayerCube, CoinOne],
        });

        const fillRect = vi.fn();
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 360;
        canvas.getContext = vi.fn(() => ({
            fillRect,
            clearRect: vi.fn(),
            setTransform: vi.fn(),
            fillText: vi.fn(),
            fillStyle: '',
            font: '',
        })) as unknown as HTMLCanvasElement['getContext'];

        const app = bootstrapLeryx({
            module: GameModule,
            canvas,
            entryLevel: 'main',
        });

        await new Promise<void>((resolve) => {
            requestAnimationFrame(() => resolve());
        });

        expect(fillRect.mock.calls.length).toBeGreaterThan(0);
        app.destroy();
    });
});
