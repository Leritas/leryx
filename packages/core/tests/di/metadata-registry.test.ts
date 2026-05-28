import { describe, expect, it } from 'vitest';
import { LeryxMetadataRegistry } from '@leryx/core';
import { compileModule } from '../../src/di/module-compiler.js';

class TestEntity {}
class TestLevel {}
class TestModule {}

describe('LeryxMetadataRegistry', () => {
    it('stores and retrieves entity metadata', () => {
        LeryxMetadataRegistry.setEntity(TestEntity, { selector: 'test-entity' });
        expect(LeryxMetadataRegistry.getEntity(TestEntity)?.selector).toBe('test-entity');
    });

    it('stores and retrieves level metadata', () => {
        LeryxMetadataRegistry.setLevel(TestLevel, { path: 'test-level' });
        expect(LeryxMetadataRegistry.getLevel(TestLevel)?.path).toBe('test-level');
    });

    it('compiles module declarations into entity and level lists', () => {
        LeryxMetadataRegistry.setModule(TestModule, {
            declarations: [TestEntity, TestLevel],
        });
        LeryxMetadataRegistry.setEntity(TestEntity, { selector: 'test-entity' });
        LeryxMetadataRegistry.setLevel(TestLevel, { path: 'test-level' });

        const compiled = compileModule(TestModule);
        expect(compiled.entityClasses).toContain(TestEntity);
        expect(compiled.levelClasses).toContain(TestLevel);
    });
});
