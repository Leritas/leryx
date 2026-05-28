import { LeryxMetadataRegistry } from './metadata-registry.js';
import type { CompiledModule, InjectionToken } from './tokens.js';

const compiledModules = new WeakMap<InjectionToken, CompiledModule>();

export function compileModule(moduleClass: InjectionToken): CompiledModule {
    const cached = compiledModules.get(moduleClass);
    if (cached) {
        return cached;
    }

    const meta = LeryxMetadataRegistry.getModule(moduleClass);
    if (!meta) {
        throw new Error(`@leryx/core: ${moduleClass.name} is not decorated with @LeryxModule.`);
    }

    const providerSet = new Set<InjectionToken>();
    const declarationSet = new Set<InjectionToken>();

    for (const provider of meta.providers ?? []) {
        providerSet.add(provider);
    }

    for (const declaration of meta.declarations ?? []) {
        declarationSet.add(declaration);
    }

    for (const importedModule of meta.imports ?? []) {
        const compiledImport = compileModule(importedModule);
        for (const provider of compiledImport.providers) {
            providerSet.add(provider);
        }
        for (const declaration of compiledImport.declarations) {
            declarationSet.add(declaration);
        }
    }

    const declarations = [...declarationSet];
    const sceneClass = declarations.find((token) => LeryxMetadataRegistry.isScene(token)) ?? null;
    const levelClasses = declarations.filter((token) => LeryxMetadataRegistry.isLevel(token));
    const entityClasses = declarations.filter(
        (token) => LeryxMetadataRegistry.isEntity(token) && !LeryxMetadataRegistry.isItem(token),
    );

    const compiled: CompiledModule = {
        moduleClass,
        providers: [...providerSet],
        declarations,
        sceneClass,
        levelClasses,
        entityClasses,
    };

    compiledModules.set(moduleClass, compiled);
    return compiled;
}
