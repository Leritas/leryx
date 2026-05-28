import { describe, expect, it, vi } from 'vitest';
import { bootstrapLeryx, LeryxMetadataRegistry } from '@leryx/core';

class BootstrapScene {}
class BootstrapLevel {}
class NoopEntity {
    readonly transform = { x: 0, y: 0, width: 10, height: 10 };
    readonly fill = '#000000';
}
class BootstrapModule {}

describe('bootstrapLeryx', () => {
    it('bootstraps a minimal module without throwing', () => {
        LeryxMetadataRegistry.setScene(BootstrapScene, {});
        LeryxMetadataRegistry.setLevel(BootstrapLevel, { path: 'main' });
        LeryxMetadataRegistry.setEntity(NoopEntity, { selector: 'noop' });
        LeryxMetadataRegistry.setModule(BootstrapModule, {
            declarations: [BootstrapScene, BootstrapLevel, NoopEntity],
        });

        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 240;
        canvas.getContext = vi.fn(() => ({
            setTransform: vi.fn(),
            clearRect: vi.fn(),
            fillRect: vi.fn(),
            fillStyle: '',
        })) as unknown as HTMLCanvasElement['getContext'];

        const app = bootstrapLeryx({
            module: BootstrapModule,
            canvas,
        });

        expect(app.destroy).toBeTypeOf('function');
        app.destroy();
    });
});
