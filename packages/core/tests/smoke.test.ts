import { describe, expect, it } from 'vitest';
import { LERYX_VERSION } from '../src/index.js';

describe('@leryx/core', () => {
    it('exports version constant', () => {
        expect(LERYX_VERSION).toBe('0.1.0');
    });
});
