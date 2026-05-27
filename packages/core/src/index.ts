/**
 * @leryx/core — Leryx.js game engine core.
 *
 * Runtime implementation is in progress. See docs/internals/ for architecture.
 */

export const LERYX_VERSION = '0.0.1' as const;

/** Bootstrap options for a Leryx application (contract stub). */
export interface BootstrapLeryxOptions {
    /** Root game module class decorated with @LeryxModule */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    module: new (...args: any[]) => unknown;
    /** Canvas element or CSS selector */
    canvas: HTMLCanvasElement | string;
}

/**
 * Bootstrap a Leryx game application.
 * @throws Not implemented until Milestone 1 (PoC).
 */
export function bootstrapLeryx(_options: BootstrapLeryxOptions): never {
    throw new Error(
        '@leryx/core: bootstrapLeryx() is not implemented yet. See docs/internals/roadmap.md (Milestone 1).',
    );
}
