import { signal } from '@preact/signals-core';

const MOVEMENT_KEYS = new Set(['KeyA', 'KeyD', 'KeyW', 'KeyS', 'ArrowLeft', 'ArrowRight']);

export class InputService {
    /** Edge-friendly: true only on frames where jump was newly pressed */
    readonly jumpRequested = signal(false);

    /** -1 left, 0 idle, 1 right */
    readonly moveX = signal(0);

    /** -1 up, 0 idle, 1 down (air control / nudge) */
    readonly moveY = signal(0);

    /** Pointer position relative to canvas (px) */
    readonly pointerX = signal(0);
    readonly pointerY = signal(0);

    /** True while pointer/touch is down */
    readonly pointerDown = signal(false);

    /** Edge: true only on frames where pointer was newly pressed */
    readonly pointerPressed = signal(false);

    private canvas: HTMLCanvasElement | null = null;
    private readonly keysDown = new Set<string>();
    private pointerWasDown = false;

    attachCanvas(canvas: HTMLCanvasElement): void {
        if (this.canvas === canvas) {
            return;
        }

        this.detach();
        this.canvas = canvas;
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        canvas.addEventListener('pointerdown', this.onPointerDown);
        canvas.addEventListener('pointermove', this.onPointerMove);
        canvas.addEventListener('pointerup', this.onPointerUp);
        canvas.addEventListener('pointercancel', this.onPointerUp);
        canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
        canvas.addEventListener('touchmove', this.onTouchMove, { passive: false });
        canvas.addEventListener('touchend', this.onTouchEnd);
        canvas.addEventListener('touchcancel', this.onTouchEnd);
    }

    detach(): void {
        if (!this.canvas) {
            return;
        }

        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        this.canvas.removeEventListener('pointerdown', this.onPointerDown);
        this.canvas.removeEventListener('pointermove', this.onPointerMove);
        this.canvas.removeEventListener('pointerup', this.onPointerUp);
        this.canvas.removeEventListener('pointercancel', this.onPointerUp);
        this.canvas.removeEventListener('touchstart', this.onTouchStart);
        this.canvas.removeEventListener('touchmove', this.onTouchMove);
        this.canvas.removeEventListener('touchend', this.onTouchEnd);
        this.canvas.removeEventListener('touchcancel', this.onTouchEnd);
        this.canvas = null;
        this.keysDown.clear();
        this.pointerWasDown = false;
        this.jumpRequested.value = false;
        this.moveX.value = 0;
        this.moveY.value = 0;
        this.pointerDown.value = false;
        this.pointerPressed.value = false;
    }

    /** Called at end of Update to consume edge-triggered input */
    clearFrameInput(): void {
        this.jumpRequested.value = false;
        this.pointerPressed.value = false;
    }

    /** @deprecated Use clearFrameInput() — clears jump edge only */
    clearJump(): void {
        this.jumpRequested.value = false;
    }

    private readonly onKeyDown = (event: KeyboardEvent): void => {
        if (MOVEMENT_KEYS.has(event.code) || event.code === 'Space') {
            event.preventDefault();
        }

        if (this.keysDown.has(event.code)) {
            return;
        }

        this.keysDown.add(event.code);

        if (event.code === 'Space' || event.code === 'KeyW') {
            this.jumpRequested.value = true;
        }

        this.syncMovement();
    };

    private readonly onKeyUp = (event: KeyboardEvent): void => {
        this.keysDown.delete(event.code);
        this.syncMovement();
    };

    private readonly onPointerDown = (event: PointerEvent): void => {
        event.preventDefault();
        this.updatePointerPosition(event.clientX, event.clientY);
        this.pointerDown.value = true;
        if (!this.pointerWasDown) {
            this.pointerPressed.value = true;
        }
        this.pointerWasDown = true;
    };

    private readonly onPointerMove = (event: PointerEvent): void => {
        this.updatePointerPosition(event.clientX, event.clientY);
    };

    private readonly onPointerUp = (event: PointerEvent): void => {
        this.updatePointerPosition(event.clientX, event.clientY);
        this.pointerDown.value = false;
        this.pointerWasDown = false;
    };

    private readonly onTouchStart = (event: TouchEvent): void => {
        event.preventDefault();
        const touch = event.changedTouches[0];
        if (!touch) {
            return;
        }
        this.updatePointerPosition(touch.clientX, touch.clientY);
        this.pointerDown.value = true;
        if (!this.pointerWasDown) {
            this.pointerPressed.value = true;
        }
        this.pointerWasDown = true;
    };

    private readonly onTouchMove = (event: TouchEvent): void => {
        event.preventDefault();
        const touch = event.changedTouches[0];
        if (!touch) {
            return;
        }
        this.updatePointerPosition(touch.clientX, touch.clientY);
    };

    private readonly onTouchEnd = (event: TouchEvent): void => {
        const touch = event.changedTouches[0];
        if (touch) {
            this.updatePointerPosition(touch.clientX, touch.clientY);
        }
        this.pointerDown.value = false;
        this.pointerWasDown = false;
    };

    private updatePointerPosition(clientX: number, clientY: number): void {
        if (!this.canvas) {
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        this.pointerX.value = (clientX - rect.left) * scaleX;
        this.pointerY.value = (clientY - rect.top) * scaleY;
    }

    private syncMovement(): void {
        let moveX = 0;
        if (this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft')) {
            moveX -= 1;
        }
        if (this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight')) {
            moveX += 1;
        }
        this.moveX.value = moveX;

        let moveY = 0;
        if (this.keysDown.has('KeyS')) {
            moveY += 1;
        }
        this.moveY.value = moveY;
    }
}
