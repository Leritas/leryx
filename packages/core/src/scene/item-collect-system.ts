import { LeryxMetadataRegistry } from '../di/metadata-registry.js';
import { createAabb, intersects } from '../math/aabb.js';
import type { Aabb } from '../physics/types.js';
import type { EntityHost } from './entity-host.js';
import type { SceneGraph } from './scene-graph.js';
import type { EntityLifecycle } from '../runtime/lifecycle.js';

export interface ItemLifecycle extends EntityLifecycle {
    onCollect?(collector: EntityHost): void;
}

function getEntityAabb(host: EntityHost): Aabb | null {
    const visual = host.getVisualState();
    const descriptor = visual.renderDescriptor;

    if (descriptor?.type === 'rect') {
        return createAabb(descriptor.x, descriptor.y, descriptor.width, descriptor.height);
    }

    if (visual.transform) {
        return createAabb(
            visual.transform.x,
            visual.transform.y,
            visual.transform.width,
            visual.transform.height,
        );
    }

    return null;
}

function findCollector(entities: readonly EntityHost[]): EntityHost | null {
    for (const entity of entities) {
        const meta = LeryxMetadataRegistry.getEntity(entity.token);
        if (meta?.role === 'player' || meta?.selector === 'player-cube') {
            return entity;
        }
    }
    return null;
}

export class ItemCollectSystem {
    constructor(private readonly sceneGraph: SceneGraph) {}

    update(entities: readonly EntityHost[], onDirty: (entityId: string) => void): void {
        let hasItems = false;
        for (const entity of entities) {
            if (LeryxMetadataRegistry.isItem(entity.token)) {
                hasItems = true;
                break;
            }
        }
        if (!hasItems) {
            return;
        }

        const collector = findCollector(entities);
        if (!collector) {
            return;
        }

        const collectorAabb = getEntityAabb(collector);
        if (!collectorAabb) {
            return;
        }

        for (const entity of [...entities]) {
            if (!LeryxMetadataRegistry.isItem(entity.token)) {
                continue;
            }

            const itemAabb = getEntityAabb(entity);
            if (!itemAabb || !intersects(collectorAabb, itemAabb)) {
                continue;
            }

            const item = entity.instance as ItemLifecycle;
            if (typeof item.onCollect === 'function') {
                try {
                    item.onCollect(collector);
                } catch (error) {
                    console.error('@leryx/core: Error in onCollect():', error);
                }
            }
            this.sceneGraph.removeEntity(entity);
            onDirty(collector.id);
        }
    }
}
