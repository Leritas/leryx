import type { DrawCommand, RenderBackend, Viewport } from './types.js';

export class Canvas2DBackend implements RenderBackend {
    readonly kind = 'canvas2d' as const;

    constructor(private readonly canvas: HTMLCanvasElement) {}

    beginFrame(viewport: Viewport): void {
        const ctx = this.getContext();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, viewport.width, viewport.height);
    }

    submit(commands: readonly DrawCommand[]): void {
        const ctx = this.getContext();
        for (const command of commands) {
            if (command.type === 'rect') {
                ctx.fillStyle = command.fill;
                ctx.fillRect(command.x, command.y, command.w, command.h);
                continue;
            }

            if (command.type === 'text') {
                ctx.fillStyle = command.fill;
                ctx.font = `${command.fontSize ?? 16}px system-ui, sans-serif`;
                ctx.fillText(command.content, command.x, command.y);
            }
        }
    }

    endFrame(): void {
        const ctx = this.getContext();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    private getContext(): CanvasRenderingContext2D {
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('@leryx/core: Canvas 2D context is unavailable.');
        }
        return ctx;
    }
}
