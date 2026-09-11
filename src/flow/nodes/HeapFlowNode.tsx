import { type NodeProps } from 'reactflow';
import { NodeShell } from '../NodeShell';
import { getNodeStateStyle } from '../nodeStateStyles';
import type { NodeVisualState, PointerBadge } from '../types';

export interface HeapFlowNodeData {
  label: string;
  index: number;
  state: NodeVisualState;
  pointers?: PointerBadge | PointerBadge[];
  radius: number;
}

export function HeapFlowNode({ data }: NodeProps<HeapFlowNodeData>) {
  const style = getNodeStateStyle(data.state);
  const size = data.radius * 2;

  return (
    <NodeShell
      className={`rounded-full border-2 ${style.fill} ${style.border} ${style.ring} transition-colors duration-300`}
      style={{ width: size, height: size }}
      pointers={data.pointers}
    >
      <div className="flex flex-col items-center">
        <span className={`font-bold text-sm ${style.text}`}>{data.label}</span>
        <span className="text-[10px] text-slate-400 absolute -bottom-5">[{data.index}]</span>
      </div>
    </NodeShell>
  );
}

export interface HeapLabelNodeData {
  label: string;
  color: string;
}

export function HeapLabelNode({ data }: NodeProps<HeapLabelNodeData>) {
  return (
    <div className="flex items-center justify-start select-none text-sm font-bold" style={{ color: data.color }}>
      {data.label}
    </div>
  );
}

export const heapNodeTypes = { heapNode: HeapFlowNode, heapLabelNode: HeapLabelNode };
