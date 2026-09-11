import { type NodeProps } from 'reactflow';
import { NodeShell } from '../NodeShell';
import { getNodeStateStyle } from '../nodeStateStyles';
import type { NodeVisualState, PointerBadge } from '../types';

export interface GraphFlowNodeData {
  label: string;
  subLabel?: string;
  state: NodeVisualState;
  pointers?: PointerBadge | PointerBadge[];
  radius: number;
}

export function GraphFlowNode({ data }: NodeProps<GraphFlowNodeData>) {
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
        {data.subLabel && <span className="text-[10px] text-slate-400 absolute -bottom-5">{data.subLabel}</span>}
      </div>
    </NodeShell>
  );
}

export const graphNodeTypes = { graphNode: GraphFlowNode };
