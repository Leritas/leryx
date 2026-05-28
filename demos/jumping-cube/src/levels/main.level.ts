import { Level } from '@leryx/core';

@Level({ path: 'main' })
export class MainLevel {
    onLoad(): void {
        // LevelManager spawns declarations from module metadata
    }
}
