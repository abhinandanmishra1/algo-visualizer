'use client';

import { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  NodeTypes,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X, Plus } from 'lucide-react';
import { TreeData } from '../../renderers/treeRenderer';

export interface TreeInputEditorProps {
  onSubmit: (tree: TreeData | null) => void;
  initialTree?: TreeData;
}

// Custom tree node component with editable label
function TreeNode({ data }: { data: { label: string; nodeId: string; onChange: (value: string) => void; onDelete: () => void } }) {
  return (
    <div className="px-3 py-2 bg-slate-800 border-2 border-slate-600 rounded-lg shadow-lg">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={data.label}
          onChange={(e) => data.onChange(e.target.value)}
          className="w-12 px-2 py-1 bg-slate-900 text-white text-sm text-center border border-slate-600 rounded focus:outline-none focus:border-indigo-500"
          placeholder="0"
        />
        <button
          onClick={data.onDelete}
          className="p-1 rounded hover:bg-red-600/20 text-red-400 hover:text-red-300 transition"
          title="Delete node"
        >
          <X size={14} />
        </button>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default function TreeInputEditor({ onSubmit, initialTree }: TreeInputEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialTree
      ? [{ id: '1', data: { label: String(initialTree.value), nodeId: '1' }, position: { x: 0, y: 0 } }]
      : [{ id: '1', data: { label: '1', nodeId: '1' }, position: { x: 250, y: 0 } }]
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialTree ? buildEdgesFromTree(initialTree) : []
  );

  const [nodeValues, setNodeValues] = useState<Record<string, string>>(
    initialTree ? gatherNodeValues(initialTree) : { '1': '1' }
  );

  const [nextNodeId, setNextNodeId] = useState(
    initialTree ? Math.max(...Object.keys(nodeValues).map((id) => parseInt(id))) + 1 : 2
  );

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      treeNode: (props: any) => (
        <TreeNode
          data={{
            ...props.data,
            onChange: (value: string) => {
              setNodeValues((prev) => ({ ...prev, [props.id]: value }));
            },
            onDelete: () => {
              deleteNode(props.id);
            },
          }}
        />
      ),
    }),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      // Only allow one connection per node (binary tree constraint)
      const sourceChildren = edges.filter((e) => e.source === connection.source);

      if (sourceChildren.length < 2) {
        setEdges((eds) => addEdge(connection, eds));
      }
    },
    [edges, setEdges]
  );

  const handleAddNode = () => {
    const newId = String(nextNodeId);
    const newNode: Node = {
      id: newId,
      type: 'treeNode',
      data: { label: '', nodeId: newId },
      position: { x: Math.random() * 400 - 200, y: Math.random() * 300 + 100 },
    };
    setNodes((ns) => [...ns, newNode]);
    setNodeValues((prev) => ({ ...prev, [newId]: '' }));
    setNextNodeId((prev) => prev + 1);
  };

  const deleteNode = (nodeId: string) => {
    if (nodeId === '1') return; // Prevent deleting root

    setNodes((ns) => ns.filter((n) => n.id !== nodeId));
    setEdges((es) => es.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setNodeValues((prev) => {
      const newValues = { ...prev };
      delete newValues[nodeId];
      return newValues;
    });
  };

  const handleLayoutTree = () => {
    // Simple tree layout algorithm
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
      setNodes([{ id: '1', type: 'treeNode', data: { label: '', nodeId: '1' }, position: { x: 250, y: 0 } }]);
      setEdges([]);
      setNodeValues({ '1': '' });
      setNextNodeId(2);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-white font-semibold mb-3">Build Binary Tree</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={handleAddNode}
            className="flex items-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition"
            title="Add a new node"
          >
            <Plus size={16} />
            Add Node
          </button>
          <button
            onClick={handleLayoutTree}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm transition"
            title="Auto-layout tree"
          >
            Layout
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-2 bg-red-700/50 hover:bg-red-700 text-red-200 rounded text-sm transition"
            title="Clear all nodes"
          >
            Clear
          </button>
        </div>

        <div className="text-xs text-slate-400 mb-3 bg-slate-900 p-3 rounded border border-slate-700">
          <p>• Click on node input fields to edit values</p>
          <p>• Drag edges from bottom handle to connect (parent → child)</p>
          <p>• Each node can have at most 2 children (left and right)</p>
        </div>
      </div>

      <div className="h-96 border-2 border-slate-600 rounded mb-4 bg-slate-950 overflow-hidden">
        <ReactFlow
          nodes={nodes.map((n) => ({
            ...n,
            type: n.type || 'treeNode',
          }))}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
        >
          Run Algorithm
        </button>
      </div>
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

  const nodeMap = new Map<string, Node>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

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
