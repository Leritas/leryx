import { bootstrapLeryx } from '@leryx/core';
import { GameModule } from './game.module.js';

const canvas = document.querySelector('#game');
if (canvas instanceof HTMLCanvasElement) {
    canvas.focus();
}

bootstrapLeryx({
    module: GameModule,
    canvas: '#game',
});
