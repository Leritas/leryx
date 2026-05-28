import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { InputService } from '../../src/input/input-service.js';

describe('InputService', () => {
    let canvas: HTMLCanvasElement;
    let input: InputService;

    beforeEach(() => {
        if (typeof globalThis.PointerEvent === 'undefined') {
            class PointerEventPolyfill extends MouseEvent {
                constructor(type: string, eventInitDict?: MouseEventInit) {
                    super(type, eventInitDict);
                }
            }
            globalThis.PointerEvent = PointerEventPolyfill as typeof PointerEvent;
        }

        canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 360;
        document.body.appendChild(canvas);
        vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
            x: 0,
            y: 0,
            width: 640,
            height: 360,
            top: 0,
            left: 0,
            right: 640,
            bottom: 360,
            toJSON: () => ({}),
        });
        input = new InputService();
        input.attachCanvas(canvas);
    });

    afterEach(() => {
        input.detach();
        canvas.remove();
    });

    it('tracks keyboard movement and jump edge', () => {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD' }));
        expect(input.moveX.value).toBe(1);

        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
        expect(input.jumpRequested.value).toBe(true);

        input.clearFrameInput();
        expect(input.jumpRequested.value).toBe(false);
    });

    it('normalizes pointer coordinates to canvas space', () => {
        canvas.dispatchEvent(
            new PointerEvent('pointerdown', {
                clientX: 320,
                clientY: 180,
                bubbles: true,
            }),
        );

        expect(input.pointerX.value).toBe(320);
        expect(input.pointerY.value).toBe(180);
        expect(input.pointerDown.value).toBe(true);
        expect(input.pointerPressed.value).toBe(true);

        input.clearFrameInput();
        expect(input.pointerPressed.value).toBe(false);
    });
});
