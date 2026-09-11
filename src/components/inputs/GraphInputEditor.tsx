'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  NodeProps,
  NodeTypes,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { arrowEdgeTypes } from '@/flow/edges/ArrowEdge';
import { getNodeStateStyle } from '@/flow/nodeStateStyles';

export interface GraphInputEditorProps {
  onSubmit: (graph: Record<string | number, (string | number)[]>) => void;
}

interface NodeData {
  label: string;
}

interface GraphNodeData extends NodeData {
  onLabelChange: (value: string) => void;
  onDelete: () => void;
}

const HANDLE_CLASS =
  '!h-2.5 !w-2.5 !border !border-slate-300 !bg-slate-500 opacity-0 transition-opacity group-hover:opacity-100';

function EditableGraphNode({ data, selected }: NodeProps<GraphNodeData>) {
  const style = getNodeStateStyle(selected ? 'active' : 'default');
  const size = 56;

  return (
    <div className="group relative flex items-center justify-center" style={{ width: size, height: size }}>
      <Handle type="target" position={Position.Top} className={HANDLE_CLASS} />
      <div
        className={`flex h-full w-full items-center justify-center rounded-full border-2 ${style.fill} ${style.border} ${style.ring} transition-colors duration-200`}
      >
        <input
          value={data.label}
          onChange={(e) => data.onLabelChange(e.target.value)}
          className={`nodrag w-10 bg-transparent text-center text-sm font-bold outline-none ${style.text}`}
        />
      </div>
      <Handle type="source" position={Position.Bottom} className={HANDLE_CLASS} />
      <button
        onClick={(e) => {
          e.stopPropagation();
          data.onDelete();
        }}
        className="nodrag absolute -top-1.5 -right-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-500 group-hover:flex"
        title="Delete node"
      >
        <X size={12} />
      </button>
    </div>
  );
}

function makeEdge(source: string, target: string, isDirected: boolean): Edge {
  return {
    id: `${source}->${target}`,
    source,
    target,
    type: 'arrow',
    markerEnd: isDirected ? { type: MarkerType.ArrowClosed, color: '#64748b', width: 16, height: 16 } : undefined,
    data: { color: '#64748b' },
  };
}

/**
 * Convert nodes and edges to adjacency list format
 */
function buildGraphFromNodes(
  nodes: Node<NodeData>[],
  edges: Edge[]
): Record<string | number, (string | number)[]> {
  const graph: Record<string | number, (string | number)[]> = {};

  nodes.forEach((node) => {
    graph[node.id] = [];
  });

  edges.forEach((edge) => {
    if (!graph[edge.source]) {
      graph[edge.source] = [];
    }
    if (!graph[edge.target]) {
      graph[edge.target] = [];
    }
    graph[edge.source].push(edge.target);
  });

  return graph;
}

/**
 * GraphInputEditor: Interactive graph builder using React Flow, styled to match
 * the read-only viewer's dark, glowing node language.
 */
export default function GraphInputEditor({ onSubmit }: GraphInputEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isDirected, setIsDirected] = useState(true);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);
  const [nodeLabel, setNodeLabel] = useState('');
  const nodeInputRef = useRef<HTMLInputElement>(null);

  const handleAddNode = useCallback(() => {
    const label = nodeLabel.trim() || String(nodeIdCounter);
    const newNode: Node<NodeData> = {
      id: String(nodeIdCounter),
      type: 'graphNode',
      data: { label },
      position: {
        x: Math.random() * 500 + 40,
        y: Math.random() * 350 + 40,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((c) => c + 1);
    setNodeLabel('');
    nodeInputRef.current?.focus();
  }, [nodeLabel, nodeIdCounter, setNodes]);

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      setEdges((eds) => addEdge(makeEdge(connection.source!, connection.target!, isDirected), eds));

      if (!isDirected) {
        setEdges((eds) => addEdge(makeEdge(connection.target!, connection.source!, false), eds));
      }
    },
    [isDirected, setEdges]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  const handleLabelChange = useCallback(
    (nodeId: string, label: string) => {
      setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, label } } : n)));
    },
    [setNodes]
  );

  const handleToggleDirected = useCallback(
    (value: string[]) => {
      const next = value[0] === 'directed';
      setIsDirected(next);

      if (next) {
        setEdges((eds) =>
          eds.map((edge) => ({
            ...edge,
            markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b', width: 16, height: 16 },
          }))
        );
        return;
      }

      setEdges((eds) => {
        const newEdges: Edge[] = [];
        eds.forEach((edge) => {
          newEdges.push({ ...edge, markerEnd: undefined });
          const reverseExists = eds.some((e) => e.source === edge.target && e.target === edge.source);
          if (!reverseExists) {
            newEdges.push(makeEdge(String(edge.target), String(edge.source), false));
          }
        });
        return newEdges;
      });
    },
    [setEdges]
  );

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      graphNode: (props: NodeProps<NodeData>) => (
        <EditableGraphNode
          {...props}
          data={{
            ...props.data,
            onLabelChange: (label) => handleLabelChange(props.id, label),
            onDelete: () => handleDeleteNode(props.id),
          }}
        />
      ),
    }),
    [handleLabelChange, handleDeleteNode]
  );

  const handleSubmit = useCallback(() => {
    if (nodes.length === 0) {
      alert('Graph must have at least one node');
      return;
    }
    const graph = buildGraphFromNodes(nodes, edges);
    onSubmit(graph);
  }, [nodes, edges, onSubmit]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4">
      <h3 className="text-white font-semibold">Build Graph</h3>

      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={arrowEdgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          deleteKeyCode={['Delete', 'Backspace']}
          fitView
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
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={nodeInputRef}
          type="text"
          value={nodeLabel}
          onChange={(e) => setNodeLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddNode();
          }}
          placeholder="Node label (optional)"
          className="w-48 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none focus:border-indigo-500"
        />
        <Button onClick={handleAddNode} size="lg">
          <Plus size={16} />
          Add Node
        </Button>

        <span className="text-sm font-semibold text-slate-300">Graph Type:</span>
        <ToggleGroup
          value={[isDirected ? 'directed' : 'undirected']}
          onValueChange={handleToggleDirected}
          variant="outline"
        >
          <ToggleGroupItem value="directed">Directed</ToggleGroupItem>
          <ToggleGroupItem value="undirected">Undirected</ToggleGroupItem>
        </ToggleGroup>

        <span className="ml-auto text-xs text-slate-400">
          {nodes.length} node{nodes.length === 1 ? '' : 's'} · {edges.length} edge{edges.length === 1 ? '' : 's'}
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Drag from the top/bottom of a node to connect it to another. Hover a node for its delete button, or select it
        and press Delete/Backspace.
      </p>

      <Button onClick={handleSubmit} size="lg" className="w-full">
        Run Algorithm
      </Button>
    </div>
  );
}
