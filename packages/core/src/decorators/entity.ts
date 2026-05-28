import { LeryxMetadataRegistry } from '../di/metadata-registry.js';
import type { EntityMetadata, InjectionToken } from '../di/tokens.js';

export function Entity(metadata: EntityMetadata) {
    return function <T extends InjectionToken>(target: T, _context: ClassDecoratorContext): T {
        LeryxMetadataRegistry.setEntity(target, metadata);
        return target;
    };
}
