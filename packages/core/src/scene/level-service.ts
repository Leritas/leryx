import type { LevelManager } from './level-manager.js';

export class LevelService {
    private manager: LevelManager | null = null;

    bind(manager: LevelManager): void {
        this.manager = manager;
    }

    load(path: string): void {
        this.manager?.loadLevel(path);
    }

    getActivePath(): string | null {
        return this.manager?.getActivePath() ?? null;
    }
}
