import { LeryxMetadataRegistry } from '../di/metadata-registry.js';
import type { InjectionToken, SceneMetadata } from '../di/tokens.js';

export function Scene(metadata: SceneMetadata = {}) {
    return function <T extends InjectionToken>(target: T, _context: ClassDecoratorContext): T {
        LeryxMetadataRegistry.setScene(target, metadata);
        return target;
    };
}
