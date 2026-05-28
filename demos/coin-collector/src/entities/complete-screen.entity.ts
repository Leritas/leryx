import { Entity, inject, LevelService, useHook } from '@leryx/core';
import { ScoreService } from '../services/score.service.js';

@Entity({ selector: 'complete-screen', level: 'complete' })
export class CompleteScreen {
    private readonly levelService = inject(LevelService);
    private readonly score = inject(ScoreService);

    readonly transform = { x: 80, y: 100, width: 480, height: 160 };
    readonly fill = '#1a472a';

    get textDescriptor() {
        return {
            type: 'text' as const,
            x: 120,
            y: 175,
            content: 'All coins collected! Press R to restart',
            fill: '#ffffff',
            fontSize: 18,
        };
    }

    onInit(): void {
        useHook(() => {
            const onKeyDown = (event: KeyboardEvent): void => {
                if (event.code === 'KeyR') {
                    this.score.reset();
                    this.levelService.load('main');
                }
            };
            window.addEventListener('keydown', onKeyDown);
            return () => window.removeEventListener('keydown', onKeyDown);
        });
    }
}
