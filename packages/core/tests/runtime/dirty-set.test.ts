import { describe, expect, it } from 'vitest';
import { DirtySet } from '../../src/runtime/dirty-set.js';

describe('DirtySet', () => {
    it('tracks marked entity ids', () => {
        const dirtySet = new DirtySet();

        expect(dirtySet.isEmpty()).toBe(true);
        dirtySet.mark('a');
        expect(dirtySet.has('a')).toBe(true);
        expect(dirtySet.isEmpty()).toBe(false);
    });

    it('clears tracked ids', () => {
        const dirtySet = new DirtySet();
        dirtySet.mark('a');
        dirtySet.clear();
        expect(dirtySet.isEmpty()).toBe(true);
        expect(dirtySet.has('a')).toBe(false);
    });
});
