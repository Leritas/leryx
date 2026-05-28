import { describe, expect, it } from 'vitest';
import { LeryxMetadataRegistry } from '@leryx/core';
import { inject } from '../../src/di/inject.js';
import { Injector } from '../../src/di/injector.js';

class RootService {
    readonly value = 42;
}

class DependentService {
    readonly dependency = inject(RootService);
}

describe('Injector', () => {
    it('resolves root singleton providers', () => {
        LeryxMetadataRegistry.setInjectable(RootService, { providedIn: 'root' });

        const injector = new Injector([RootService]);
        const first = injector.get(RootService);
        const second = injector.get(RootService);
        expect(first).toBe(second);
        expect(first.value).toBe(42);
    });

    it('resolves inject() during service construction', () => {
        LeryxMetadataRegistry.setInjectable(RootService, { providedIn: 'root' });
        LeryxMetadataRegistry.setInjectable(DependentService, { providedIn: 'root' });

        const injector = new Injector([RootService, DependentService]);
        const service = injector.get(DependentService);
        expect(service.dependency.value).toBe(42);
    });

    it('creates scoped instances in child injectors', () => {
        class LevelService {
            readonly id = Math.random();
        }

        LeryxMetadataRegistry.setInjectable(LevelService, { providedIn: 'level' });

        const root = new Injector([LevelService]);
        const childA = root.createChild();
        const childB = root.createChild();

        const a = childA.get(LevelService);
        const b = childB.get(LevelService);
        expect(a).not.toBe(b);
    });
});
