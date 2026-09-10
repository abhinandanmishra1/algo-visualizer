export interface RenderOptions {
  width: number;
  height: number;
  dpr: number;
  aspectRatio: '16:9' | '9:16';
  burnInCaption?: string;
  theme?: 'dark' | 'light';
}

export interface AlgoRenderer<TData = any, TState = any> {
  render(
    ctx: CanvasRenderingContext2D,
    data: TData,
    state: TState,
    options: RenderOptions
  ): void;
}
