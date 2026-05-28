import { LeryxMetadataRegistry } from '../di/metadata-registry.js';
import { runInInjectionContext } from '../di/injection-context.js';
import type { Injector } from '../di/injector.js';
import type { InjectionToken } from '../di/tokens.js';
import { beginEntityInit, endEntityInit } from '../reactivity/hooks.js';
import type { HookDisposer } from '../reactivity/hooks.js';
import { callLifecycleHook } from '../runtime/lifecycle.js';
import type { EntityLifecycle } from '../runtime/lifecycle.js';
import type {
    EntityVisualState,
    RectRenderDescriptor,
    StaticTransformDescriptor,
} from '../renderer/types.js';

let nextEntityId = 0;

export class EntityHost {
    readonly id: string;
    instance!: EntityLifecycle;
    private started = false;
    private destroyed = false;
    private readonly hookDisposers: HookDisposer[] = [];

    constructor(
        readonly token: InjectionToken,
        readonly injector: Injector,
        private readonly onDirty: (entityId: string) => void,
    ) {
        this.id = `entity-${nextEntityId++}`;
    }

    get selector(): string {
        return LeryxMetadataRegistry.getEntity(this.token)?.selector ?? this.token.name;
    }

    initialize(): void {
        runInInjectionContext(this.injector, () => {
            this.instance = new this.token() as EntityLifecycle;
            beginEntityInit(this);
            try {
                callLifecycleHook(this.instance, 'onInit');
            } finally {
                endEntityInit();
            }
        });
    }

    start(): void {
        if (this.started || this.destroyed) {
            return;
        }
        this.started = true;
        callLifecycleHook(this.instance, 'onStart');
    }

    fixedUpdate(dt: number): void {
        if (this.destroyed) {
            return;
        }
        callLifecycleHook(this.instance, 'onFixedUpdate', dt);
    }

    update(dt: number): void {
        if (this.destroyed) {
            return;
        }
        callLifecycleHook(this.instance, 'onUpdate', dt);
    }

    destroy(): void {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        for (const disposer of this.hookDisposers.splice(0)) {
            try {
                disposer();
            } catch (error) {
                console.error('@leryx/core: Error in useHook disposer:', error);
            }
        }
        callLifecycleHook(this.instance, 'onDestroy');
    }

    registerHookDisposer(disposer: HookDisposer): void {
        this.hookDisposers.push(disposer);
    }

    markDirty(): void {
        this.onDirty(this.id);
    }

    getVisualState(): EntityVisualState {
        const instance = this.instance as EntityLifecycle & {
            renderDescriptor?: RectRenderDescriptor;
            transform?: StaticTransformDescriptor;
            fill?: string;
        };

        let renderDescriptor: RectRenderDescriptor | undefined;
        if ('renderDescriptor' in instance) {
            const descriptor = (instance as { renderDescriptor?: RectRenderDescriptor })
                .renderDescriptor;
            if (descriptor !== undefined) {
                renderDescriptor = descriptor;
            }
        }

        return {
            renderDescriptor,
            transform: instance.transform,
            fill: instance.fill,
        };
    }
}
