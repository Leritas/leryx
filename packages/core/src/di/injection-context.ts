import type { Injector } from './injector.js';

const injectionStack: Injector[] = [];

export function pushInjectionContext(injector: Injector): void {
    injectionStack.push(injector);
}

export function popInjectionContext(): void {
    injectionStack.pop();
}

export function currentInjector(): Injector | undefined {
    return injectionStack[injectionStack.length - 1];
}

export function runInInjectionContext<T>(injector: Injector, fn: () => T): T {
    pushInjectionContext(injector);
    try {
        return fn();
    } finally {
        popInjectionContext();
    }
}
