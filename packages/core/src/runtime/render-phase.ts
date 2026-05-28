import type { EntityHost } from '../scene/entity-host.js';
import { CommandBuffer } from '../renderer/command-buffer.js';
import type { DrawCommand, RenderBackend, Viewport } from '../renderer/types.js';
import type { DirtySet } from './dirty-set.js';

export class RenderPhase {
    constructor(
        private readonly backend: RenderBackend,
        private readonly commandBuffer: CommandBuffer,
    ) {}

    render(
        entities: readonly EntityHost[],
        dirtySet: DirtySet,
        viewport: Viewport,
        renderAll = false,
    ): void {
        const commands: DrawCommand[] = [];

        for (const entity of entities) {
            if (!renderAll && !dirtySet.isEmpty() && !dirtySet.has(entity.id)) {
                continue;
            }

            const visual = entity.getVisualState();
            const descriptor = visual.renderDescriptor;

            if (descriptor?.type === 'rect') {
                commands.push({
                    type: 'rect',
                    x: descriptor.x,
                    y: descriptor.y,
                    w: descriptor.width,
                    h: descriptor.height,
                    fill: descriptor.fill,
                });
                continue;
            }

            if (visual.transform) {
                commands.push({
                    type: 'rect',
                    x: visual.transform.x,
                    y: visual.transform.y,
                    w: visual.transform.width,
                    h: visual.transform.height,
                    fill: visual.fill ?? '#ffffff',
                });
            }

            const text = visual.textDescriptor;
            if (text?.type === 'text') {
                commands.push({
                    type: 'text',
                    x: text.x,
                    y: text.y,
                    content: text.content,
                    fill: text.fill,
                    fontSize: text.fontSize,
                });
            }
        }

        this.backend.beginFrame(viewport);
        this.commandBuffer.appendAll(commands);
        this.backend.submit(this.commandBuffer.drain());
        this.backend.endFrame();
    }
}
