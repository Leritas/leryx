export class DirtySet {
    private readonly dirtyIds = new Set<string>();

    mark(entityId: string): void {
        this.dirtyIds.add(entityId);
    }

    has(entityId: string): boolean {
        return this.dirtyIds.has(entityId);
    }

    isEmpty(): boolean {
        return this.dirtyIds.size === 0;
    }

    clear(): void {
        this.dirtyIds.clear();
    }

    values(): Iterable<string> {
        return this.dirtyIds;
    }
}
