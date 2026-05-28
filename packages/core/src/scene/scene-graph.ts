import type { Injector } from '../di/injector.js';
import type { InjectionToken } from '../di/tokens.js';
import { EntityHost } from './entity-host.js';

export class SceneGraph {
    private readonly entities = new Map<string, EntityHost>();
    private readonly entityOrder: EntityHost[] = [];

    spawnEntity(
        token: InjectionToken,
        injector: Injector,
        onDirty: (entityId: string) => void,
    ): EntityHost {
        const host = new EntityHost(token, injector, onDirty);
        this.entities.set(host.id, host);
        this.entityOrder.push(host);
        host.initialize();
        return host;
    }

    startAll(): void {
        for (const entity of this.entityOrder) {
            entity.start();
        }
    }

    getEntities(): readonly EntityHost[] {
        return this.entityOrder;
    }

    getEntity(id: string): EntityHost | undefined {
        return this.entities.get(id);
    }

    destroyAll(): void {
        for (const entity of [...this.entityOrder].reverse()) {
            entity.destroy();
        }
        this.entities.clear();
        this.entityOrder.length = 0;
    }

    removeEntity(host: EntityHost): void {
        if (!this.entities.has(host.id)) {
            return;
        }

        host.destroy();
        this.entities.delete(host.id);
        const index = this.entityOrder.indexOf(host);
        if (index >= 0) {
            this.entityOrder.splice(index, 1);
        }
    }
}
