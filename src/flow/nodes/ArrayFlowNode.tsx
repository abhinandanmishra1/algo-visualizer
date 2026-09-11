import { type NodeProps } from 'reactflow';
import { BoxCellShell, BOX_VALUE_TEXT_CLASS, BOX_SUBLABEL_TEXT_CLASS } from '../BoxCellShell';
import { getNodeStateStyle } from '../nodeStateStyles';
import type { NodeVisualState, PointerBadge } from '../types';

export interface ArrayFlowNodeData {
  label: string;
  index: number;
  state: NodeVisualState;
  pointers?: PointerBadge | PointerBadge[];
  width: number;
  height: number;
}

export function ArrayFlowNode({ data }: NodeProps<ArrayFlowNodeData>) {
  const style = getNodeStateStyle(data.state);

  return (
    <BoxCellShell
      width={data.width}
      height={data.height}
      colorClasses={`${style.fill} ${style.border} ${style.ring}`}
      pointers={data.pointers}
    >
      <span className={`${BOX_VALUE_TEXT_CLASS} ${style.text}`}>{data.label}</span>
      <span className={BOX_SUBLABEL_TEXT_CLASS}>{`[${data.index}]`}</span>
    </BoxCellShell>
  );
}

export interface ArrayLabelFlowNodeData {
  text: string;
}

export function ArrayLabelFlowNode({ data }: NodeProps<ArrayLabelFlowNodeData>) {
  return (
    <div className="text-sm font-bold text-sky-400 whitespace-nowrap select-none">{data.text}</div>
  );
}

export const arrayNodeTypes = {
  arrayNode: ArrayFlowNode,
  arrayLabel: ArrayLabelFlowNode,
};
