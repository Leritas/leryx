import { LeryxMetadataRegistry } from './metadata-registry.js';
import type { InjectableMetadata, LeryxModuleMetadata, InjectionToken } from './tokens.js';

export function LeryxModule(metadata: LeryxModuleMetadata) {
    return function <T extends InjectionToken>(target: T, _context: ClassDecoratorContext): T {
        LeryxMetadataRegistry.setModule(target, metadata);
        return target;
    };
}

export function Injectable(metadata: InjectableMetadata = { providedIn: 'root' }) {
    return function <T extends InjectionToken>(target: T, _context: ClassDecoratorContext): T {
        LeryxMetadataRegistry.setInjectable(target, metadata);
        return target;
    };
}
