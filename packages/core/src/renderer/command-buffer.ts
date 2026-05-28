import type { DrawCommand } from './types.js';

export class CommandBuffer {
    private commands: DrawCommand[] = [];

    append(command: DrawCommand): void {
        this.commands.push(command);
    }

    appendAll(commands: readonly DrawCommand[]): void {
        this.commands.push(...commands);
    }

    drain(): DrawCommand[] {
        const snapshot = this.commands;
        this.commands = [];
        return snapshot;
    }
}
