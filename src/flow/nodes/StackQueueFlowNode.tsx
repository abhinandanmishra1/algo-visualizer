import { type NodeProps } from 'reactflow';
import { BoxCellShell, BOX_VALUE_TEXT_CLASS, BOX_SUBLABEL_TEXT_CLASS } from '../BoxCellShell';
import { getNodeStateStyle } from '../nodeStateStyles';
import type { NodeVisualState, PointerBadge } from '../types';

export interface StackQueueFlowNodeData {
  value: unknown;
  index: number;
  state: NodeVisualState;
  pointers?: PointerBadge | PointerBadge[];
  width: number;
  height: number;
}

export function StackQueueFlowNode({ data }: NodeProps<StackQueueFlowNodeData>) {
  const style = getNodeStateStyle(data.state);
  const valueStr = String(data.value);
  const displayValue = valueStr.length > 10 ? `${valueStr.substring(0, 10)}...` : valueStr;

  return (
    <BoxCellShell
      width={data.width}
      height={data.height}
      colorClasses={`${style.fill} ${style.border} ${style.ring}`}
      pointers={data.pointers}
    >
      <span className={`${BOX_VALUE_TEXT_CLASS} ${style.text}`}>{displayValue}</span>
      <span className={BOX_SUBLABEL_TEXT_CLASS}>{`[${data.index}]`}</span>
    </BoxCellShell>
  );
}

export const stackQueueNodeTypes = { stackQueueNode: StackQueueFlowNode };
