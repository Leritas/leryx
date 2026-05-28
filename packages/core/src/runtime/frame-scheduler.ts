import type { EntityHost } from '../scene/entity-host.js';
import type { RenderBackend, Viewport } from '../renderer/types.js';
import { CommandBuffer } from '../renderer/command-buffer.js';
import { DirtySet } from './dirty-set.js';
import { RenderPhase } from './render-phase.js';
import { FIXED_TIMESTEP, MAX_FRAME_DELTA, SignalFlushPhase, UpdatePhase } from './update-phase.js';

export interface FrameSchedulerOptions {
    backend: RenderBackend;
    getEntities: () => readonly EntityHost[];
    viewport: Viewport;
}

export class FrameScheduler {
    private readonly dirtySet = new DirtySet();
    private readonly updatePhase = new UpdatePhase();
    private readonly signalFlushPhase: SignalFlushPhase;
    private readonly renderPhase: RenderPhase;
    private rafId: number | null = null;
    private lastTimestamp: number | null = null;
    private running = false;

    constructor(private readonly options: FrameSchedulerOptions) {
        this.signalFlushPhase = new SignalFlushPhase(this.dirtySet);
        this.renderPhase = new RenderPhase(options.backend, new CommandBuffer());
    }

    start(): void {
        if (this.running) {
            return;
        }
        this.running = true;
        this.lastTimestamp = null;
        this.rafId = requestAnimationFrame(this.loop);
    }

    stop(): void {
        this.running = false;
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.lastTimestamp = null;
    }

    tick(dt: number): void {
        const entities = this.options.getEntities();
        const clampedDt = Math.min(dt, MAX_FRAME_DELTA);

        this.signalFlushPhase.flush(entities);
        this.updatePhase.runFixedUpdate(entities, FIXED_TIMESTEP);
        this.updatePhase.runVariableUpdate(entities, clampedDt);

        for (const entity of entities) {
            this.dirtySet.mark(entity.id);
        }

        this.renderPhase.render(entities, this.dirtySet, this.options.viewport, true);
        this.dirtySet.clear();
    }

    markDirty(entityId: string): void {
        this.dirtySet.mark(entityId);
    }

    private readonly loop = (timestamp: number): void => {
        if (!this.running) {
            return;
        }

        const dt =
            this.lastTimestamp === null ? FIXED_TIMESTEP : (timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;

        this.tick(dt);
        this.rafId = requestAnimationFrame(this.loop);
    };
}
