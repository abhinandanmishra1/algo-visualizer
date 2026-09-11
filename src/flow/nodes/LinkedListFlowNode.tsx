import { type NodeProps } from 'reactflow';
import { NodeShell } from '../NodeShell';
import { getNodeStateStyle } from '../nodeStateStyles';
import type { NodeVisualState, PointerBadge } from '../types';

export interface LinkedListFlowNodeData {
  label: string;
  index: number;
  state: NodeVisualState;
  isCycleStart: boolean;
  pointers?: PointerBadge | PointerBadge[];
  radius: number;
}

export function LinkedListFlowNode({ data }: NodeProps<LinkedListFlowNodeData>) {
  const style = getNodeStateStyle(data.state);
  const size = data.radius * 2;

  return (
    <NodeShell
      className={`rounded-full border-2 ${style.fill} ${style.border} ${style.ring} transition-colors duration-300`}
      style={{ width: size, height: size }}
      pointers={data.pointers}
    >
      <span className={`font-bold text-sm ${style.text}`}>{data.label}</span>
      <span className="absolute top-full mt-1 text-[10px] text-slate-400">{`[${data.index}]`}</span>
      {data.isCycleStart && (
        <span className="absolute bottom-full mb-1 text-[10px] font-bold text-cyan-400 whitespace-nowrap">
          CYCLE START
        </span>
      )}
    </NodeShell>
  );
}

export const linkedListNodeTypes = { linkedListNode: LinkedListFlowNode };
