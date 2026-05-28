import { Entity } from '@leryx/core';

@Entity({ selector: 'ground', level: 'main' })
export class Ground {
    readonly transform = { x: 0, y: 340, width: 640, height: 20 };
    readonly fill = '#333333';
}
