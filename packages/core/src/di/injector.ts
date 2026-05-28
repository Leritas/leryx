import { runInInjectionContext } from './injection-context.js';
import { LeryxMetadataRegistry } from './metadata-registry.js';
import type { InjectionToken } from './tokens.js';

export class Injector {
    private readonly instances = new Map<InjectionToken, unknown>();
    private readonly parent: Injector | null;

    constructor(
        private readonly providers: readonly InjectionToken[] = [],
        parent: Injector | null = null,
    ) {
        this.parent = parent;
    }

    createChild(providers: readonly InjectionToken[] = []): Injector {
        return new Injector([...this.providers, ...providers], this);
    }

    get<T>(token: InjectionToken<T>): T {
        if (this.instances.has(token)) {
            return this.instances.get(token) as T;
        }

        const rootInjector = this.getRoot();

        if (rootInjector.instances.has(token)) {
            return rootInjector.instances.get(token) as T;
        }

        if (!this.canProvide(token)) {
            throw new Error(
                `@leryx/core: No provider for ${token.name}. Register it in @LeryxModule({ providers: [...] }).`,
            );
        }

        const instance = runInInjectionContext(this, () => new token());
        const injectableMeta = LeryxMetadataRegistry.getInjectable(token);
        const scope = injectableMeta?.providedIn ?? 'root';

        if (scope === 'root') {
            rootInjector.instances.set(token, instance);
        } else {
            this.instances.set(token, instance);
        }

        return instance as T;
    }

    has(token: InjectionToken): boolean {
        if (this.instances.has(token)) {
            return true;
        }

        const rootInjector = this.getRoot();
        if (rootInjector.instances.has(token)) {
            return true;
        }

        return this.canProvide(token);
    }

    private canProvide(token: InjectionToken): boolean {
        if (this.providers.includes(token)) {
            return true;
        }

        if (LeryxMetadataRegistry.getInjectable(token)) {
            return true;
        }

        return this.parent?.canProvide(token) ?? false;
    }

    private getRoot(): Injector {
        if (this.parent) {
            return this.parent.getRoot();
        }
        return this;
    }
}
