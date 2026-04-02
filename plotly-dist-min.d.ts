declare module "plotly.js-dist-min" {
  const Plotly: {
    newPlot(el: HTMLElement, data: unknown[], layout?: unknown, config?: unknown): Promise<unknown>;
    react(el: HTMLElement, data: unknown[], layout?: unknown, config?: unknown): Promise<unknown>;
    purge(el: HTMLElement): void;
    update(el: HTMLElement, update: unknown, layout?: unknown): Promise<unknown>;
  };
  export = Plotly;
}
