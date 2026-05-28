import { LeryxMetadataRegistry } from '../di/metadata-registry.js';
import type { InjectionToken, LevelMetadata } from '../di/tokens.js';

export function Level(metadata: LevelMetadata) {
    return function <T extends InjectionToken>(target: T, _context: ClassDecoratorContext): T {
        LeryxMetadataRegistry.setLevel(target, metadata);
        return target;
    };
}
