export interface EntityLifecycle {
    onInit?(): void;
    onStart?(): void;
    onFixedUpdate?(dt: number): void;
    onUpdate?(dt: number): void;
    onDestroy?(): void;
}

export interface LevelLifecycle {
    onLoad?(): void;
    onActivate?(): void;
    onUnload?(): void;
}

export interface SceneLifecycle {
    onInit?(): void;
}

export type LifecycleHookName =
    | 'onInit'
    | 'onStart'
    | 'onFixedUpdate'
    | 'onUpdate'
    | 'onDestroy'
    | 'onLoad'
    | 'onActivate'
    | 'onUnload';

export function callLifecycleHook(
    instance: object,
    hook: LifecycleHookName,
    ...args: unknown[]
): void {
    const candidate = instance as Record<string, unknown>;
    const fn = candidate[hook];
    if (typeof fn === 'function') {
        try {
            fn.apply(instance, args);
        } catch (error) {
            console.error(`@leryx/core: Error in ${hook}():`, error);
        }
    }
}
