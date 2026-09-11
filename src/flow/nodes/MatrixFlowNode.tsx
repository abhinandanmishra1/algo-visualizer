import { type NodeProps } from 'reactflow';
import { BoxCellShell, BOX_VALUE_TEXT_CLASS } from '../BoxCellShell';
import { getNodeStateStyle } from '../nodeStateStyles';
import type { NodeVisualState } from '../types';

export interface MatrixFlowNodeData {
  value?: string | number;
  state: NodeVisualState;
  heatmapColor?: string;
  width: number;
  height: number;
}

export function MatrixFlowNode({ data }: NodeProps<MatrixFlowNodeData>) {
  const style = getNodeStateStyle(data.state);
  const hasHeatmap = data.heatmapColor !== undefined && data.state === 'default';

  return (
    <BoxCellShell
      width={data.width}
      height={data.height}
      colorClasses={hasHeatmap ? 'border-slate-600' : `${style.fill} ${style.border} ${style.ring}`}
      style={hasHeatmap ? { backgroundColor: data.heatmapColor } : undefined}
    >
      <span className={`${BOX_VALUE_TEXT_CLASS} ${hasHeatmap ? 'text-slate-50' : style.text}`}>
        {data.value ?? ''}
      </span>
    </BoxCellShell>
  );
}

export interface MatrixLabelNodeData {
  label: string;
}

export function MatrixLabelNode({ data }: NodeProps<MatrixLabelNodeData>) {
  return (
    <div className="flex items-center justify-center select-none text-xs text-slate-400">
      {data.label}
    </div>
  );
}

export const matrixNodeTypes = { matrixNode: MatrixFlowNode, matrixLabelNode: MatrixLabelNode };
