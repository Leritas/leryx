import { Injectable, inject, LevelService } from '@leryx/core';
import { signal } from '@leryx/core/reactivity';

export const TOTAL_COINS = 6;

@Injectable({ providedIn: 'root' })
export class ScoreService {
    private readonly levelService = inject(LevelService);

    readonly collected = signal(0);

    addCoin(): void {
        this.collected.value += 1;
        if (this.collected.value >= TOTAL_COINS) {
            this.levelService.load('complete');
        }
    }

    reset(): void {
        this.collected.value = 0;
    }
}
