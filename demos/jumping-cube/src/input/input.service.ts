import { Injectable } from '@leryx/core';
import { signal } from '@leryx/core/reactivity';

const MOVEMENT_KEYS = new Set(['KeyA', 'KeyD', 'KeyW', 'KeyS', 'ArrowLeft', 'ArrowRight']);

@Injectable({ providedIn: 'root' })
export class InputService {
    /** Edge-friendly: true only on frames where jump was newly pressed */
    readonly jumpRequested = signal(false);

    /** -1 left, 0 idle, 1 right */
    readonly moveX = signal(0);

    /** -1 up, 0 idle, 1 down (air control / nudge) */
    readonly moveY = signal(0);

    private readonly keysDown = new Set<string>();

    constructor() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    /** Called by scheduler at end of Update to consume jump edge */
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
