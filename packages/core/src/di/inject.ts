import { currentInjector } from './injection-context.js';
import type { InjectionToken } from './tokens.js';

export function inject<T>(token: InjectionToken<T>): T {
    const injector = currentInjector();
    if (!injector) {
        throw new Error(
            '@leryx/core: inject() must be called during onInit or within a service constructor resolved by DI.',
        );
    }
    return injector.get(token);
}
