import { describe, expect, it, vi } from 'vitest';
import { Canvas2DBackend } from '../../src/renderer/canvas2d-backend.js';

describe('Canvas2DBackend', () => {
    it('submits rect draw commands to canvas', () => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;

        const fillRect = vi.fn();
        const clearRect = vi.fn();
        const setTransform = vi.fn();

        canvas.getContext = vi.fn(() => ({
            fillRect,
            clearRect,
            setTransform,
            fillText: vi.fn(),
            fillStyle: '',
            font: '',
        })) as unknown as HTMLCanvasElement['getContext'];

        const backend = new Canvas2DBackend(canvas);
        backend.beginFrame({ width: 100, height: 100 });
        backend.submit([
            {
                type: 'rect',
                x: 10,
                y: 20,
                w: 30,
                h: 40,
                fill: '#ff0000',
            },
        ]);
        backend.endFrame();

        expect(fillRect).toHaveBeenCalledWith(10, 20, 30, 40);
    });

    it('submits text draw commands to canvas', () => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;

        const fillText = vi.fn();
        canvas.getContext = vi.fn(() => ({
            fillRect: vi.fn(),
            clearRect: vi.fn(),
            setTransform: vi.fn(),
            fillText,
            fillStyle: '',
            font: '',
        })) as unknown as HTMLCanvasElement['getContext'];

        const backend = new Canvas2DBackend(canvas);
        backend.beginFrame({ width: 100, height: 100 });
        backend.submit([
            {
                type: 'text',
                x: 12,
                y: 24,
                content: 'Hello',
                fill: '#ffffff',
                fontSize: 14,
            },
        ]);
        backend.endFrame();

        expect(fillText).toHaveBeenCalledWith('Hello', 12, 24);
    });
});
