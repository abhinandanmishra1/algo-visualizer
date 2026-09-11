'use client';

import { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
  NodeTypes,
  NodeProps,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { arrowEdgeTypes } from '@/flow/edges/ArrowEdge';
import { getNodeStateStyle } from '@/flow/nodeStateStyles';
import { TreeData } from '../../renderers/treeRenderer';

export interface TreeInputEditorProps {
  onSubmit: (tree: TreeData | null) => void;
  initialTree?: TreeData;
}

interface TreeNodeData {
  label: string;
  onLabelChange: (value: string) => void;
  onDelete: () => void;
  deletable: boolean;
}

const HANDLE_CLASS =
  '!h-2.5 !w-2.5 !border !border-slate-300 !bg-slate-500 opacity-0 transition-opacity group-hover:opacity-100';

function EditableTreeNode({ data, selected }: NodeProps<TreeNodeData>) {
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
          placeholder="0"
          className={`nodrag w-10 bg-transparent text-center text-sm font-bold outline-none ${style.text}`}
        />
      </div>
      <Handle type="source" position={Position.Bottom} className={HANDLE_CLASS} />
      {data.deletable && (
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
      )}
    </div>
  );
}

export default function TreeInputEditor({ onSubmit, initialTree }: TreeInputEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<{ label: string }>(
    initialTree
      ? [
          {
            id: '1',
            type: 'treeNode',
            data: { label: String(initialTree.value) },
            position: { x: 250, y: 0 },
            deletable: false,
          },
        ]
      : [{ id: '1', type: 'treeNode', data: { label: '1' }, position: { x: 250, y: 0 }, deletable: false }]
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(
    initialTree ? buildEdgesFromTree(initialTree) : []
  );

  const [nodeValues, setNodeValues] = useState<Record<string, string>>(
    initialTree ? gatherNodeValues(initialTree) : { '1': '1' }
  );

  const [nextNodeId, setNextNodeId] = useState(
    initialTree ? Math.max(...Object.keys(nodeValues).map((id) => parseInt(id))) + 1 : 2
  );

  const handleLabelChange = useCallback(
    (nodeId: string, value: string) => {
      setNodeValues((prev) => ({ ...prev, [nodeId]: value }));
      setNodes((ns) => ns.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, label: value } } : n)));
    },
    [setNodes]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      if (nodeId === '1') return; // Prevent deleting root

      setNodes((ns) => ns.filter((n) => n.id !== nodeId));
      setEdges((es) => es.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setNodeValues((prev) => {
        const newValues = { ...prev };
        delete newValues[nodeId];
        return newValues;
      });
    },
    [setNodes, setEdges]
  );

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      treeNode: (props: NodeProps<{ label: string }>) => (
        <EditableTreeNode
          {...props}
          data={{
            label: props.data.label,
            deletable: props.id !== '1',
            onLabelChange: (value) => handleLabelChange(props.id, value),
            onDelete: () => deleteNode(props.id),
          }}
        />
      ),
    }),
    [handleLabelChange, deleteNode]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      // Only allow one connection per node (binary tree constraint)
      const sourceChildren = edges.filter((e) => e.source === connection.source);

      if (sourceChildren.length < 2) {
        setEdges((eds) => addEdge({ ...connection, type: 'arrow' }, eds));
      }
    },
    [edges, setEdges]
  );

  const handleAddNode = () => {
    const newId = String(nextNodeId);
    const newNode: Node = {
      id: newId,
      type: 'treeNode',
      data: { label: '' },
      position: { x: Math.random() * 500 + 40, y: Math.random() * 350 + 40 },
    };
    setNodes((ns) => [...ns, newNode]);
    setNodeValues((prev) => ({ ...prev, [newId]: '' }));
    setNextNodeId((prev) => prev + 1);
  };

  const handleLayoutTree = () => {
    const updatedNodes = computeTreeLayout(nodes, edges);
    setNodes(updatedNodes);
  };

  const handleSubmit = () => {
    const tree = buildTreeFromNodes(nodes, edges, nodeValues);
    if (!tree) {
      alert('Invalid tree: Root node must have a value');
      return;
    }
    onSubmit(tree);
  };

  const handleClear = () => {
    if (window.confirm('Clear the entire tree?')) {
      setNodes([{ id: '1', type: 'treeNode', data: { label: '' }, position: { x: 250, y: 0 }, deletable: false }]);
      setEdges([]);
      setNodeValues({ '1': '' });
      setNextNodeId(2);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4">
      <h3 className="text-white font-semibold">Build Binary Tree</h3>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleAddNode} size="lg" title="Add a new node">
          <Plus size={16} />
          Add Node
        </Button>
        <Button onClick={handleLayoutTree} variant="secondary" size="lg" title="Auto-layout tree">
          Layout
        </Button>
        <Button onClick={handleClear} variant="destructive" size="lg" title="Clear all nodes">
          Clear
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={arrowEdgeTypes}
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

      <p className="text-xs text-slate-500">
        Drag from the bottom of a node to the top of another to connect them (max 2 children). Hover a node for its
        delete button, or select it and press Delete/Backspace.
      </p>

      <Button onClick={handleSubmit} size="lg" className="w-full">
        Run Algorithm
      </Button>
    </div>
  );
}

// Helper: Build edges from a tree structure
function buildEdgesFromTree(tree: TreeData, parentId: string = '1', visitedNodes = new Set<TreeData>()): Edge[] {
  if (!tree || visitedNodes.has(tree)) return [];

  visitedNodes.add(tree);
  const edges: Edge[] = [];
  let childIndex = 0;

  if (tree.left) {
    const childId = tree.left.id ? String(tree.left.id) : String(childIndex + 1);
    edges.push({
      id: `${parentId}-${childId}-left`,
      source: parentId,
      target: childId,
      type: 'arrow',
    });
    edges.push(...buildEdgesFromTree(tree.left, childId, visitedNodes));
    childIndex++;
  }

  if (tree.right) {
    const childId = tree.right.id ? String(tree.right.id) : String(childIndex + 1);
    edges.push({
      id: `${parentId}-${childId}-right`,
      source: parentId,
      target: childId,
      type: 'arrow',
    });
    edges.push(...buildEdgesFromTree(tree.right, childId, visitedNodes));
  }

  return edges;
}

// Helper: Gather node values from tree
function gatherNodeValues(tree: TreeData, acc: Record<string, string> = {}): Record<string, string> {
  if (!tree) return acc;

  const id = tree.id ? String(tree.id) : '1';
  acc[id] = String(tree.value || '');

  if (tree.left) gatherNodeValues(tree.left, acc);
  if (tree.right) gatherNodeValues(tree.right, acc);

  return acc;
}

// Helper: Build tree from nodes and edges
function buildTreeFromNodes(
  nodes: Node[],
  edges: Edge[],
  values: Record<string, string>
): TreeData | null {
  const rootNode = nodes.find((n) => n.id === '1');
  if (!rootNode) return null;

  const buildNode = (nodeId: string, visited = new Set<string>()): TreeData => {
    if (visited.has(nodeId)) return { value: values[nodeId] || 0 };

    visited.add(nodeId);

    const childEdges = edges.filter((e) => e.source === nodeId);
    const sortedChildren = childEdges.sort(
      (a, b) => (a.id?.includes('left') ? -1 : 1) - (b.id?.includes('left') ? -1 : 1)
    );

    return {
      value: isNaN(Number(values[nodeId])) ? values[nodeId] : Number(values[nodeId]),
      id: nodeId,
      left: sortedChildren[0] ? buildNode(sortedChildren[0].target, visited) : undefined,
      right: sortedChildren[1] ? buildNode(sortedChildren[1].target, visited) : undefined,
    };
  };

  return buildNode('1');
}

// Helper: Compute tree layout using simple tree layout algorithm
function computeTreeLayout(nodes: Node[], edges: Edge[]): Node[] {
  const positions: Record<string, { x: number; y: number }> = {};

  const computePositions = (nodeId: string, x: number, y: number, offset: number) => {
    positions[nodeId] = { x, y };

    const childEdges = edges.filter((e) => e.source === nodeId);
    const verticalGap = 100;
    const horizontalGap = offset;

    childEdges.forEach((edge, index) => {
      const childX = x + (index === 0 ? -horizontalGap : horizontalGap);
      const childY = y + verticalGap;
      computePositions(edge.target, childX, childY, horizontalGap / 2);
    });
  };

  computePositions('1', 250, 0, 100);

  return nodes.map((n) => ({
    ...n,
    position: positions[n.id] || n.position,
  }));
}
