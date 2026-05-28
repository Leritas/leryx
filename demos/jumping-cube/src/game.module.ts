import { LeryxModule } from '@leryx/core';
import { MainLevel } from './levels/main.level.js';
import { PlayerCube } from './entities/player-cube.entity.js';
import { Ground } from './entities/ground.entity.js';
import { InputModule } from './input/input.module.js';
import { GameScene } from './game.scene.js';

@LeryxModule({
    imports: [InputModule],
    declarations: [GameScene, MainLevel, Ground, PlayerCube],
})
export class GameModule {}
