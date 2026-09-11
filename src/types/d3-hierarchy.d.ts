declare module 'd3-hierarchy' {
  export function tree<T>(): TreeLayout<T>;
  export function hierarchy<T>(
    data: T,
    children?: (d: T) => T[] | undefined
  ): HierarchyNode<T>;

  export interface TreeLayout<T> {
    size(size: [number, number]): TreeLayout<T>;
    (root: HierarchyNode<T>): HierarchyNode<T>;
  }

  export interface HierarchyNode<T> {
    data: T;
    parent: HierarchyNode<T> | null;
    children?: HierarchyNode<T>[];
    x?: number;
    y?: number;
    each(callback: (node: HierarchyNode<T>) => void): void;
    links(): HierarchyLink<T>[];
  }

  export interface HierarchyLink<T> {
    source: HierarchyNode<T>;
    target: HierarchyNode<T>;
  }
}
