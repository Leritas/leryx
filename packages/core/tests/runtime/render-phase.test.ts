import { describe, expect, it, vi } from 'vitest';
import { DirtySet } from '../../src/runtime/dirty-set.js';
import { RenderPhase } from '../../src/runtime/render-phase.js';
import type { EntityHost } from '../../src/scene/entity-host.js';
import type { RenderBackend } from '../../src/renderer/types.js';
import { CommandBuffer } from '../../src/renderer/command-buffer.js';

function createMockEntity(id: string, fill: string): EntityHost {
    return {
        id,
        getVisualState: vi.fn(() => ({
            renderDescriptor: {
                type: 'rect' as const,
                x: 0,
                y: 0,
                width: 10,
                height: 10,
                fill,
            },
        })),
    } as unknown as EntityHost;
}

function createMockBackend(): RenderBackend & { submit: ReturnType<typeof vi.fn> } {
    return {
        kind: 'canvas2d',
        beginFrame: vi.fn(),
        submit: vi.fn(),
        endFrame: vi.fn(),
    };
}

describe('RenderPhase', () => {
    it('renders only dirty entities when renderAll is false', () => {
        const backend = createMockBackend();
        const renderPhase = new RenderPhase(backend, new CommandBuffer());
        const dirtySet = new DirtySet();
        const player = createMockEntity('player', '#fff');
        const ground = createMockEntity('ground', '#333');

        dirtySet.mark('player');

        renderPhase.render([player, ground], dirtySet, { width: 640, height: 360 });

        expect(backend.submit).toHaveBeenCalledWith([
            {
                type: 'rect',
                x: 0,
                y: 0,
                w: 10,
                h: 10,
                fill: '#fff',
            },
        ]);
    });

    it('renders all entities when dirty set is empty and renderAll is true', () => {
        const backend = createMockBackend();
        const renderPhase = new RenderPhase(backend, new CommandBuffer());
        const dirtySet = new DirtySet();
        const player = createMockEntity('player', '#fff');
        const ground = createMockEntity('ground', '#333');

        renderPhase.render([player, ground], dirtySet, { width: 640, height: 360 }, true);

        expect(backend.submit).toHaveBeenCalledWith([
            {
                type: 'rect',
                x: 0,
                y: 0,
                w: 10,
                h: 10,
                fill: '#fff',
            },
            {
                type: 'rect',
                x: 0,
                y: 0,
                w: 10,
                h: 10,
                fill: '#333',
            },
        ]);
    });
});
