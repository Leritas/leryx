import { describe, expect, it, vi } from 'vitest';
import { FrameScheduler } from '../../src/runtime/frame-scheduler.js';
import type { EntityHost } from '../../src/scene/entity-host.js';
import type { RenderBackend } from '../../src/renderer/types.js';

function createMockEntity(name: string): EntityHost {
    return {
        id: name,
        fixedUpdate: vi.fn(),
        update: vi.fn(),
        getVisualState: vi.fn(() => ({
            renderDescriptor: {
                type: 'rect' as const,
                x: 0,
                y: 0,
                width: 10,
                height: 10,
                fill: '#fff',
            },
        })),
    } as unknown as EntityHost;
}

function createMockBackend(): RenderBackend & {
    beginFrame: ReturnType<typeof vi.fn>;
    submit: ReturnType<typeof vi.fn>;
    endFrame: ReturnType<typeof vi.fn>;
} {
    return {
        kind: 'canvas2d',
        beginFrame: vi.fn(),
        submit: vi.fn(),
        endFrame: vi.fn(),
    };
}

describe('FrameScheduler', () => {
    it('runs signal flush, fixed update, variable update, then render', () => {
        const entity = createMockEntity('player');
        const backend = createMockBackend();
        const callOrder: string[] = [];

        entity.fixedUpdate = vi.fn(() => {
            callOrder.push('fixed');
        });
        entity.update = vi.fn(() => {
            callOrder.push('update');
        });
        backend.beginFrame = vi.fn(() => {
            callOrder.push('render-begin');
        });
        backend.submit = vi.fn(() => {
            callOrder.push('render-submit');
        });
        backend.endFrame = vi.fn(() => {
            callOrder.push('render-end');
        });

        const scheduler = new FrameScheduler({
            backend,
            getEntities: () => [entity],
            viewport: { width: 640, height: 360 },
        });

        scheduler.tick(1 / 60);

        expect(callOrder).toEqual([
            'fixed',
            'update',
            'render-begin',
            'render-submit',
            'render-end',
        ]);
        expect(entity.fixedUpdate).toHaveBeenCalledWith(1 / 60);
        expect(entity.update).toHaveBeenCalledWith(1 / 60);
    });
});
