import { useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  MarkerType,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { arrowEdgeTypes } from './edges/ArrowEdge';

interface FlowVisualizerProps {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  edgeTypes?: EdgeTypes;
  burnInCaption?: string;
  className?: string;
  interactive?: boolean;
}

/**
 * Shared React Flow shell for every structural renderer (graph, tree, array,
 * linked-list, matrix, stack/queue, heap, hash-table, diagram). Each renderer
 * type supplies its own node/edge components + a pure data adapter; this
 * component only owns the canvas chrome (pan/zoom, minimap, background grid).
 */
export function FlowVisualizer({
  nodes,
  edges,
  nodeTypes,
  edgeTypes,
  burnInCaption,
  className = '',
  interactive = true,
}: FlowVisualizerProps) {
  const mergedEdgeTypes = useMemo(() => ({ ...arrowEdgeTypes, ...edgeTypes }), [edgeTypes]);

  const edgesWithMarkers = useMemo(
    () =>
      edges.map((e) => ({
        ...e,
        markerEnd: e.markerEnd ?? { type: MarkerType.ArrowClosed, color: '#64748b', width: 16, height: 16 },
      })),
    [edges]
  );

  return (
    <div
      className={`relative w-full h-full min-h-[300px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950 ${className}`}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edgesWithMarkers}
          nodeTypes={nodeTypes}
          edgeTypes={mergedEdgeTypes}
          nodesDraggable={interactive}
          nodesConnectable={false}
          elementsSelectable={interactive}
          panOnScroll
          zoomOnScroll
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e293b" />
          <Controls className="!bg-slate-900 !border-slate-700 !fill-slate-300 [&_button]:!border-slate-700 [&_button:hover]:!bg-slate-800" />
          <MiniMap
            className="!bg-slate-900 !border !border-slate-700 !w-28 !h-20"
            maskColor="rgba(2,6,23,0.6)"
            nodeColor="#334155"
            pannable
            zoomable
          />
        </ReactFlow>
        {burnInCaption && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/80 border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 shadow-lg">
            {burnInCaption}
          </div>
        )}
      </ReactFlowProvider>
    </div>
  );
}
