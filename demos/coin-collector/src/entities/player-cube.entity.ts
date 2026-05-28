import {
    Entity,
    inject,
    InputService,
    useHook,
    AabbPhysicsResolver,
    createAabb,
} from '@leryx/core';
import { signal, effect } from '@leryx/core/reactivity';

const GRAVITY = 1200;
const JUMP_VELOCITY = -420;
const MOVE_SPEED = 220;
const AIR_CONTROL = 0.6;
const CANVAS_WIDTH = 640;
const CUBE_SIZE = 40;
const GROUND_TOP = 340;
const GROUND_Y = GROUND_TOP - CUBE_SIZE;

const physics = new AabbPhysicsResolver();
const staticColliders = [createAabb(0, GROUND_TOP, CANVAS_WIDTH, 20)];

@Entity({ selector: 'player-cube', level: 'main', role: 'player' })
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

        let vy = this.velocityY.value;
        if (!this.isGrounded.value && this.input.moveY.value > 0) {
            vy += GRAVITY * 0.35 * dt;
        }
        vy += GRAVITY * dt;

        const resolved = physics.resolveAgainstStatic(
            createAabb(x, this.posY.value, CUBE_SIZE, CUBE_SIZE),
            { x: 0, y: vy * dt },
            staticColliders,
        );

        this.posX.value = resolved.position.x;
        this.posY.value = resolved.position.y;
        if (resolved.onGround) {
            this.velocityY.value = 0;
            this.isGrounded.value = true;
        } else {
            this.velocityY.value = vy;
            this.isGrounded.value = false;
        }
    }

    onUpdate(_dt: number): void {
        this.input.clearFrameInput();
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
