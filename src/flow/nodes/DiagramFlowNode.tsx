import { type NodeProps } from 'reactflow';
import { NodeShell } from '../NodeShell';
import { getNodeStateStyle } from '../nodeStateStyles';
import type { NodeVisualState } from '../types';

export interface DiagramFlowNodeData {
  label: string;
  shape: 'box' | 'circle' | 'db' | 'cloud';
  state: NodeVisualState;
  width: number;
  height: number;
}

const SHAPE_CLASSES: Record<DiagramFlowNodeData['shape'], string> = {
  box: 'rounded-lg border-2',
  circle: 'rounded-full border-2',
  db: 'rounded-lg border-2 border-t-4',
  cloud: 'rounded-3xl border-2 border-dashed',
};

export function DiagramFlowNode({ data }: NodeProps<DiagramFlowNodeData>) {
  const style = getNodeStateStyle(data.state);
  const size = data.shape === 'circle' ? Math.max(data.width, data.height) : undefined;
  const width = size ?? data.width;
  const height = size ?? data.height;

  return (
    <NodeShell
      className={`${SHAPE_CLASSES[data.shape]} ${style.fill} ${style.border} ${style.ring} transition-colors duration-300 px-2`}
      style={{ width, height }}
    >
      <span className={`text-center font-bold text-xs ${style.text}`}>{data.label}</span>
    </NodeShell>
  );
}

export const diagramNodeTypes = { diagramNode: DiagramFlowNode };
