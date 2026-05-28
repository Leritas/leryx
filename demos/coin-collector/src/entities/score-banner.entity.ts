import { Entity, inject, useHook, trackVisualEffect } from '@leryx/core';
import { ScoreService, TOTAL_COINS } from '../services/score.service.js';

@Entity({ selector: 'score-banner', level: 'main' })
export class ScoreBanner {
    private readonly score = inject(ScoreService);

    onInit(): void {
        useHook(() =>
            trackVisualEffect(() => {
                void this.score.collected.value;
            }),
        );
    }

    get renderDescriptor() {
        const progress = this.score.collected.value / TOTAL_COINS;
        return {
            type: 'rect' as const,
            x: 16,
            y: 16,
            width: 140 + progress * 80,
            height: 24,
            fill: '#f5c542',
        };
    }
}
