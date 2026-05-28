export interface Viewport {
    width: number;
    height: number;
}

export type DrawCommand =
    | {
          type: 'rect';
          x: number;
          y: number;
          w: number;
          h: number;
          fill: string;
      }
    | {
          type: 'text';
          x: number;
          y: number;
          content: string;
          fill: string;
          fontSize?: number;
      };

export interface RenderBackend {
    readonly kind: 'canvas2d' | 'webgl';
    beginFrame(viewport: Viewport): void;
    submit(commands: readonly DrawCommand[]): void;
    endFrame(): void;
}

export interface RectRenderDescriptor {
    type: 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
}

export interface StaticTransformDescriptor {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface TextRenderDescriptor {
    type: 'text';
    x: number;
    y: number;
    content: string;
    fill: string;
    fontSize?: number;
}

export interface EntityVisualState {
    transform?: StaticTransformDescriptor;
    fill?: string;
    renderDescriptor?: RectRenderDescriptor;
    textDescriptor?: TextRenderDescriptor;
}
