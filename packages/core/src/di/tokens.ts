/** Constructor token used for DI resolution. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InjectionToken<T = unknown> = new (...args: any[]) => T;

export type ProvidedIn = 'root' | 'level';

export interface InjectableMetadata {
    providedIn: ProvidedIn;
}

export interface LeryxModuleMetadata {
    imports?: InjectionToken[];
    providers?: InjectionToken[];
    declarations?: InjectionToken[];
}

export interface EntityMetadata {
    selector: string;
}

export interface LevelMetadata {
    path: string;
}

export interface ItemMetadata {
    kind: string;
    stackable?: boolean;
}

export interface SceneMetadata {
    entryLevel?: string;
}

export type DeclarationKind = 'entity' | 'level' | 'scene' | 'item' | 'module' | 'unknown';

export interface CompiledModule {
    moduleClass: InjectionToken;
    providers: InjectionToken[];
    declarations: InjectionToken[];
    sceneClass: InjectionToken | null;
    levelClasses: InjectionToken[];
    entityClasses: InjectionToken[];
}
