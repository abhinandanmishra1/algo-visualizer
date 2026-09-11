import type { Node, Edge, NodeTypes, EdgeTypes } from 'reactflow';

/**
 * Common visual state a structure node can be in. Mirrors the color language
 * already used by the canvas renderers (renderers/*.ts) so the interactive
 * React Flow view and the exported video stay visually consistent.
 */
export type NodeVisualState =
  | 'default'
  | 'active'
  | 'visited'
  | 'visiting'
  | 'highlight'
  | 'eliminated'
  | 'found';

export interface PointerBadge {
  label: string;
  color?: string;
  icon?: string;
  position?: 'top' | 'bottom';
}

export interface FlowAdapterResult {
  nodes: Node[];
  edges: Edge[];
}

/**
 * Converts an algorithm's structural data + current playback state into
 * React Flow nodes/edges. Pure function — no side effects, easy to unit test.
 */
export interface FlowAdapter<TData = any, TState = any> {
  toFlow(data: TData, state: TState, width: number, height: number): FlowAdapterResult;
}

export interface FlowRendererModule {
  adapter: FlowAdapter;
  nodeTypes: NodeTypes;
  edgeTypes?: EdgeTypes;
}
