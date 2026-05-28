import { describe, expect, it, vi } from 'vitest';
import { LeryxMetadataRegistry } from '@leryx/core';
import { signal, effect } from '../../src/reactivity/index.js';
import { Injector } from '../../src/di/injector.js';
import { EntityHost } from '../../src/scene/entity-host.js';
import { FrameScheduler } from '../../src/runtime/frame-scheduler.js';
import { FIXED_TIMESTEP } from '../../src/runtime/update-phase.js';
import type { RenderBackend } from '../../src/renderer/types.js';

const GRAVITY = 1200;
const JUMP_VELOCITY = -420;
const GROUND_Y = 320;

class JumpInputService {
    readonly jumpRequested = signal(false);

    requestJump(): void {
        this.jumpRequested.value = true;
    }

    clearJump(): void {
        this.jumpRequested.value = false;
    }
}

class JumpingCubeEntity {
    readonly input = new JumpInputService();
    readonly velocityY = signal(0);
    readonly posY = signal(GROUND_Y);
    readonly isGrounded = signal(true);
    private effectDisposer: (() => void) | null = null;

    onInit(): void {
        this.effectDisposer = effect(() => {
            if (this.input.jumpRequested.value && this.isGrounded.value) {
                this.velocityY.value = JUMP_VELOCITY;
                this.isGrounded.value = false;
            }
        });
    }

    onFixedUpdate(dt: number): void {
        let vy = this.velocityY.value;
        let y = this.posY.value;

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

    onUpdate(): void {
        this.input.clearJump();
    }

    onDestroy(): void {
        this.effectDisposer?.();
    }

    get renderDescriptor() {
        return {
            type: 'rect' as const,
            x: 100,
            y: this.posY.value,
            width: 40,
            height: 40,
            fill: '#4a90d9',
        };
    }
}

function createMockBackend(): RenderBackend {
    return {
        kind: 'canvas2d',
        beginFrame: vi.fn(),
        submit: vi.fn(),
        endFrame: vi.fn(),
    };
}

describe('jumping cube integration', () => {
    it('applies jump impulse and returns to ground after simulation frames', () => {
        LeryxMetadataRegistry.setEntity(JumpingCubeEntity, { selector: 'jump-cube' });

        const injector = new Injector([]);
        const host = new EntityHost(JumpingCubeEntity, injector, () => undefined);
        host.initialize();
        host.start();

        const cube = host.instance as JumpingCubeEntity;
        const backend = createMockBackend();
        const scheduler = new FrameScheduler({
            backend,
            getEntities: () => [host],
            viewport: { width: 640, height: 360 },
        });

        scheduler.tick(FIXED_TIMESTEP);
        expect(cube.posY.value).toBe(GROUND_Y);
        expect(cube.isGrounded.value).toBe(true);

        cube.input.requestJump();
        scheduler.tick(FIXED_TIMESTEP);
        expect(cube.posY.value).toBeLessThan(GROUND_Y);
        expect(cube.isGrounded.value).toBe(false);

        for (let i = 0; i < 120; i++) {
            scheduler.tick(FIXED_TIMESTEP);
        }

        expect(cube.posY.value).toBe(GROUND_Y);
        expect(cube.isGrounded.value).toBe(true);
        host.destroy();
    });
});
