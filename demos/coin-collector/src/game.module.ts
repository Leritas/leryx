import { LeryxModule } from '@leryx/core';
import { InputModule } from '@leryx/core';
import { GameScene } from './game.scene.js';
import { MainLevel } from './levels/main.level.js';
import { CompleteLevel } from './levels/complete.level.js';
import { PlayerCube } from './entities/player-cube.entity.js';
import { Ground } from './entities/ground.entity.js';
import { ScoreBanner } from './entities/score-banner.entity.js';
import { CompleteScreen } from './entities/complete-screen.entity.js';
import { ScoreService } from './services/score.service.js';
import { CoinOne, CoinTwo, CoinThree, CoinFour, CoinFive, CoinSix } from './items/coin.item.js';

@LeryxModule({
    imports: [InputModule],
    providers: [ScoreService],
    declarations: [
        GameScene,
        MainLevel,
        CompleteLevel,
        Ground,
        PlayerCube,
        ScoreBanner,
        CompleteScreen,
        CoinOne,
        CoinTwo,
        CoinThree,
        CoinFour,
        CoinFive,
        CoinSix,
    ],
})
export class GameModule {}
