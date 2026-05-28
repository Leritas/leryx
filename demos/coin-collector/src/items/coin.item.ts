import { Item, inject } from '@leryx/core';
import { ScoreService } from '../services/score.service.js';

const COIN_SIZE = 16;

abstract class CoinBase {
    protected readonly score = inject(ScoreService);

    constructor(
        private readonly x: number,
        private readonly y: number,
    ) {}

    onCollect(): void {
        this.score.addCoin();
    }

    get renderDescriptor() {
        return {
            type: 'rect' as const,
            x: this.x,
            y: this.y,
            width: COIN_SIZE,
            height: COIN_SIZE,
            fill: '#f5c542',
        };
    }
}

@Item({ kind: 'coin', level: 'main' })
export class CoinOne extends CoinBase {
    constructor() {
        super(180, 280);
    }
}

@Item({ kind: 'coin', level: 'main' })
export class CoinTwo extends CoinBase {
    constructor() {
        super(260, 240);
    }
}

@Item({ kind: 'coin', level: 'main' })
export class CoinThree extends CoinBase {
    constructor() {
        super(340, 280);
    }
}

@Item({ kind: 'coin', level: 'main' })
export class CoinFour extends CoinBase {
    constructor() {
        super(420, 220);
    }
}

@Item({ kind: 'coin', level: 'main' })
export class CoinFive extends CoinBase {
    constructor() {
        super(500, 280);
    }
}

@Item({ kind: 'coin', level: 'main' })
export class CoinSix extends CoinBase {
    constructor() {
        super(560, 220);
    }
}
