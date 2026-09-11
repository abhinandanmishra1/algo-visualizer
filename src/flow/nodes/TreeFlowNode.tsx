import { type NodeProps } from 'reactflow';
import { NodeShell } from '../NodeShell';
import { getNodeStateStyle } from '../nodeStateStyles';
import type { NodeVisualState, PointerBadge } from '../types';

export interface TreeFlowNodeData {
  label: string;
  state: NodeVisualState;
  pointers?: PointerBadge | PointerBadge[];
  radius: number;
}

export function TreeFlowNode({ data }: NodeProps<TreeFlowNodeData>) {
  const style = getNodeStateStyle(data.state);
  const size = data.radius * 2;

  return (
    <NodeShell
      className={`rounded-full border-2 ${style.fill} ${style.border} ${style.ring} transition-colors duration-300`}
      style={{ width: size, height: size }}
      pointers={data.pointers}
    >
      <span className={`font-bold text-sm ${style.text}`}>{data.label}</span>
    </NodeShell>
  );
}

export const treeNodeTypes = { treeNode: TreeFlowNode };
