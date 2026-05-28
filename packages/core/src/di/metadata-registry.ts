import type {
    EntityMetadata,
    InjectableMetadata,
    ItemMetadata,
    LevelMetadata,
    LeryxModuleMetadata,
    SceneMetadata,
    InjectionToken,
} from './tokens.js';

const moduleMetadata = new WeakMap<InjectionToken, LeryxModuleMetadata>();
const injectableMetadata = new WeakMap<InjectionToken, InjectableMetadata>();
const entityMetadata = new WeakMap<InjectionToken, EntityMetadata>();
const levelMetadata = new WeakMap<InjectionToken, LevelMetadata>();
const sceneMetadata = new WeakMap<InjectionToken, SceneMetadata>();
const itemMetadata = new WeakMap<InjectionToken, ItemMetadata>();

export const LeryxMetadataRegistry = {
    setModule(token: InjectionToken, meta: LeryxModuleMetadata): void {
        moduleMetadata.set(token, meta);
    },

    getModule(token: InjectionToken): LeryxModuleMetadata | undefined {
        return moduleMetadata.get(token);
    },

    setInjectable(token: InjectionToken, meta: InjectableMetadata): void {
        injectableMetadata.set(token, meta);
    },

    getInjectable(token: InjectionToken): InjectableMetadata | undefined {
        return injectableMetadata.get(token);
    },

    setEntity(token: InjectionToken, meta: EntityMetadata): void {
        entityMetadata.set(token, meta);
    },

    getEntity(token: InjectionToken): EntityMetadata | undefined {
        return entityMetadata.get(token);
    },

    setLevel(token: InjectionToken, meta: LevelMetadata): void {
        levelMetadata.set(token, meta);
    },

    getLevel(token: InjectionToken): LevelMetadata | undefined {
        return levelMetadata.get(token);
    },

    setScene(token: InjectionToken, meta: SceneMetadata): void {
        sceneMetadata.set(token, meta);
    },

    getScene(token: InjectionToken): SceneMetadata | undefined {
        return sceneMetadata.get(token);
    },

    setItem(token: InjectionToken, meta: ItemMetadata): void {
        itemMetadata.set(token, meta);
    },

    getItem(token: InjectionToken): ItemMetadata | undefined {
        return itemMetadata.get(token);
    },

    isEntity(token: InjectionToken): boolean {
        return entityMetadata.has(token);
    },

    isLevel(token: InjectionToken): boolean {
        return levelMetadata.has(token);
    },

    isScene(token: InjectionToken): boolean {
        return sceneMetadata.has(token);
    },

    isItem(token: InjectionToken): boolean {
        return itemMetadata.has(token);
    },
};
