import { Entity, inject, useHook } from '@leryx/core';
import { signal, effect } from '@leryx/core/reactivity';
import { InputService } from '../input/input.service.js';

const GRAVITY = 1200;
const JUMP_VELOCITY = -420;
const MOVE_SPEED = 220;
const AIR_CONTROL = 0.6;
const CANVAS_WIDTH = 640;
const CUBE_SIZE = 40;

/** Top edge of the ground platform (must match ground.entity.ts transform.y) */
const GROUND_TOP = 340;
/** Cube y when resting on the ground (top-left origin) */
const GROUND_Y = GROUND_TOP - CUBE_SIZE;

@Entity({ selector: 'player-cube' })
export class PlayerCube {
    private readonly input = inject(InputService);

    readonly velocityY = signal(0);
    readonly posX = signal(100);
    readonly posY = signal(GROUND_Y);
    readonly isGrounded = signal(true);

    onInit(): void {
        useHook(() => {
            return effect(() => {
                if (this.input.jumpRequested.value && this.isGrounded.value) {
                    this.velocityY.value = JUMP_VELOCITY;
                    this.isGrounded.value = false;
                }
            });
        });
    }

    onFixedUpdate(dt: number): void {
        let x = this.posX.value;
        const moveX = this.input.moveX.value;
        if (moveX !== 0) {
            const control = this.isGrounded.value ? 1 : AIR_CONTROL;
            x += moveX * MOVE_SPEED * control * dt;
        }
        x = Math.max(0, Math.min(CANVAS_WIDTH - CUBE_SIZE, x));
        this.posX.value = x;

        let vy = this.velocityY.value;
        let y = this.posY.value;

        if (!this.isGrounded.value && this.input.moveY.value > 0) {
            vy += GRAVITY * 0.35 * dt;
        }

        vy += GRAVITY * dt;
        y += vy * dt;

        if (y >= GROUND_Y) {
            y = GROUND_Y;
            vy = 0;
            this.isGrounded.value = true;
        } else {
            this.isGrounded.value = false;
        }

        this.velocityY.value = vy;
        this.posY.value = y;
    }

    onUpdate(_dt: number): void {
        this.input.clearJump();
    }

    get renderDescriptor() {
        return {
            type: 'rect' as const,
            x: this.posX.value,
            y: this.posY.value,
            width: CUBE_SIZE,
            height: CUBE_SIZE,
            fill: this.isGrounded.value ? '#4a90d9' : '#6ab0f9',
        };
    }
}
