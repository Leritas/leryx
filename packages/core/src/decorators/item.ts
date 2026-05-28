import { LeryxMetadataRegistry } from '../di/metadata-registry.js';
import type { InjectionToken, ItemMetadata } from '../di/tokens.js';

export function Item(metadata: ItemMetadata) {
    return function <T extends InjectionToken>(target: T, _context: ClassDecoratorContext): T {
        LeryxMetadataRegistry.setItem(target, metadata);
        LeryxMetadataRegistry.setEntity(target, { selector: metadata.kind });
        return target;
    };
}
