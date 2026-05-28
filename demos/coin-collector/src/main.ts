import { bootstrapLeryx } from '@leryx/core';
import { GameModule } from './game.module.js';

bootstrapLeryx({
    module: GameModule,
    canvas: '#game',
    entryLevel: 'main',
});
