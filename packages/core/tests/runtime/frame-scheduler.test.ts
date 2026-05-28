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
        expect(entity.update).toHaveBeenCalledTimes(1);
        expect(entity.update).toHaveBeenCalledWith(1 / 60);
    });

    it('runs multiple fixed updates when catching up', () => {
        const entity = createMockEntity('player');
        const backend = createMockBackend();

        const scheduler = new FrameScheduler({
            backend,
            getEntities: () => [entity],
            viewport: { width: 640, height: 360 },
            maxFixedStepsPerFrame: 5,
        });

        scheduler.tick(0.1);

        expect(entity.fixedUpdate).toHaveBeenCalledTimes(3);
        expect(entity.update).toHaveBeenCalledTimes(1);
        expect(entity.update).toHaveBeenCalledWith(0.05);
    });

    it('renders only dirty entities after the initial frame', () => {
        const ground = createMockEntity('ground');
        const player = createMockEntity('player');
        const backend = createMockBackend();

        ground.getVisualState = vi.fn(() => ({
            transform: { x: 0, y: 340, width: 640, height: 20 },
            fill: '#333333',
        }));
        player.getVisualState = vi.fn(() => ({
            renderDescriptor: {
                type: 'rect' as const,
                x: 10,
                y: 10,
                width: 20,
                height: 20,
                fill: '#4a90d9',
            },
        }));

        const scheduler = new FrameScheduler({
            backend,
            getEntities: () => [ground, player],
            viewport: { width: 640, height: 360 },
        });

        scheduler.markDirty('ground');
        scheduler.markDirty('player');
        scheduler.tick(1 / 60);

        expect(backend.submit).toHaveBeenLastCalledWith([
            {
                type: 'rect',
                x: 0,
                y: 340,
                w: 640,
                h: 20,
                fill: '#333333',
            },
            {
                type: 'rect',
                x: 10,
                y: 10,
                w: 20,
                h: 20,
                fill: '#4a90d9',
            },
        ]);

        backend.submit.mockClear();
        scheduler.markDirty('player');
        scheduler.tick(1 / 60);

        expect(backend.submit).toHaveBeenCalledWith([
            {
                type: 'rect',
                x: 10,
                y: 10,
                w: 20,
                h: 20,
                fill: '#4a90d9',
            },
        ]);
    });
});
