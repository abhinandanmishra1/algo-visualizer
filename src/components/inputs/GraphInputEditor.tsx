'use client';

import { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X, Plus } from 'lucide-react';

export interface GraphInputEditorProps {
  onSubmit: (graph: Record<string | number, (string | number)[]>) => void;
}

interface NodeData {
  label: string;
}

/**
 * Convert nodes and edges to adjacency list format
 */
function buildGraphFromNodes(
  nodes: Node<NodeData>[],
  edges: Edge[]
): Record<string | number, (string | number)[]> {
  const graph: Record<string | number, (string | number)[]> = {};

  // Initialize all nodes
  nodes.forEach((node) => {
    graph[node.id] = [];
  });

  // Add edges
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
 * GraphInputEditor: Interactive graph builder using React Flow
 * Allows creating nodes and edges, with directed/undirected toggle
 */
export default function GraphInputEditor({ onSubmit }: GraphInputEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isDirected, setIsDirected] = useState(true);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);
  const [nodeLabel, setNodeLabel] = useState('');
  const nodeInputRef = useRef<HTMLInputElement>(null);

  /**
   * Add a new node to the graph
   */
  const handleAddNode = useCallback(() => {
    const label = nodeLabel.trim() || String(nodeIdCounter);
    const newNode: Node<NodeData> = {
      id: String(nodeIdCounter),
      data: { label },
      position: {
        x: Math.random() * 400,
        y: Math.random() * 300,
      },
      style: {
        background: '#1e293b',
        border: '2px solid #475569',
        color: '#f8fafc',
        borderRadius: '8px',
        padding: '8px 12px',
        fontSize: '14px',
        fontWeight: 'bold',
        minWidth: '50px',
        textAlign: 'center',
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter((c) => c + 1);
    setNodeLabel('');
    if (nodeInputRef.current) {
      nodeInputRef.current.focus();
    }
  }, [nodeLabel, nodeIdCounter, setNodes]);

  /**
   * Handle edge connection (add directed/undirected edge)
   */
  const handleConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        id: `${connection.source}->${connection.target}`,
        source: connection.source || '',
        target: connection.target || '',
        animated: true,
        markerEnd: isDirected ? { type: 'arrowclosed' } : undefined,
      };

      setEdges((eds) => addEdge(newEdge, eds));

      // For undirected graphs, also add reverse edge
      if (!isDirected && connection.source && connection.target) {
        const reverseEdge: Edge = {
          id: `${connection.target}->${connection.source}`,
          source: connection.target,
          target: connection.source,
          animated: true,
          markerEnd: undefined,
        };
        setEdges((eds) => addEdge(reverseEdge, eds));
      }
    },
    [isDirected, setEdges]
  );

  /**
   * Delete a node and its associated edges
   */
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  /**
   * Toggle between directed and undirected graph
   */
  const handleToggleDirected = useCallback(() => {
    setIsDirected(!isDirected);
    // When switching to undirected, add reverse edges
    if (!isDirected) {
      const newEdges: Edge[] = [];
      edges.forEach((edge) => {
        newEdges.push(edge);
        // Check if reverse edge exists
        const reverseExists = edges.some(
          (e) => e.source === edge.target && e.target === edge.source
        );
        if (!reverseExists) {
          newEdges.push({
            id: `${edge.target}->${edge.source}`,
            source: edge.target,
            target: edge.source,
            animated: true,
          });
        }
      });
      setEdges(newEdges);
    }
  }, [isDirected, edges, setEdges]);

  /**
   * Submit the graph
   */
  const handleSubmit = useCallback(() => {
    if (nodes.length === 0) {
      alert('Graph must have at least one node');
      return;
    }
    const graph = buildGraphFromNodes(nodes, edges);
    onSubmit(graph);
  }, [nodes, edges, onSubmit]);

  return (
    <div className="p-4 flex flex-col h-full">
      <h3 className="text-white font-semibold mb-3">Build Graph</h3>

      {/* React Flow Canvas */}
      <div className="h-96 border border-slate-600 rounded mb-4 bg-slate-900 flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          fitView
          deleteKeyCode="Delete"
        >
          <Background color="#334155" gap={16} />
          <Controls
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '6px',
            }}
          />
          <MiniMap
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid #475569',
              borderRadius: '4px',
            }}
          />
        </ReactFlow>

        {/* Delete Node Button Overlay */}
        <div className="absolute top-2 right-2 flex gap-1 flex-wrap max-w-xs">
          {nodes.map((node) => (
            <button
              key={`delete-${node.id}`}
              onClick={() => handleDeleteNode(node.id)}
              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded flex items-center gap-1"
              title={`Delete node ${node.data.label}`}
            >
              <X size={12} />
              {node.data.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {/* Add Node */}
        <div className="flex gap-2">
          <input
            ref={nodeInputRef}
            type="text"
            value={nodeLabel}
            onChange={(e) => setNodeLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddNode();
            }}
            placeholder="Node label (optional)"
            className="flex-1 px-3 py-2 bg-slate-800 text-white border border-slate-600 rounded text-sm placeholder-slate-400"
          />
          <button
            onClick={handleAddNode}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded flex items-center gap-2"
          >
            <Plus size={16} />
            Add Node
          </button>
        </div>

        {/* Toggle Directed/Undirected */}
        <div className="flex items-center gap-3">
          <label className="text-white text-sm font-semibold">Graph Type:</label>
          <button
            onClick={handleToggleDirected}
            className={`px-4 py-2 rounded font-semibold text-white transition ${
              isDirected
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isDirected ? 'Directed' : 'Undirected'}
          </button>
        </div>

        {/* Instructions */}
        <div className="text-xs text-slate-400 bg-slate-800 p-2 rounded">
          <p>1. Click "Add Node" to create nodes</p>
          <p>2. Drag from one node to another to create edges</p>
          <p>3. Click the delete button to remove nodes</p>
          <p>4. Toggle Directed/Undirected to change graph type</p>
        </div>

        {/* Stats */}
        <div className="text-xs text-slate-300 space-y-1">
          <p>Nodes: {nodes.length}</p>
          <p>Edges: {edges.length}</p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded"
        >
          Run Algorithm
        </button>
      </div>
    </div>
  );
}
