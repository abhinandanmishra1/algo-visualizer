import { type NodeProps } from 'reactflow';
import { BoxCellShell, BOX_VALUE_TEXT_CLASS } from '../BoxCellShell';
import { getNodeStateStyle } from '../nodeStateStyles';
import type { NodeVisualState } from '../types';

export interface HashBucketFlowNodeData {
  index: number;
  collisionCount: number;
  state: NodeVisualState;
  isEmpty: boolean;
  width: number;
  height: number;
}

export function HashBucketFlowNode({ data }: NodeProps<HashBucketFlowNodeData>) {
  const style = getNodeStateStyle(data.state);
  const dimmed = data.isEmpty && data.state === 'default' ? 'opacity-60' : '';

  return (
    <BoxCellShell
      width={data.width}
      height={data.height}
      colorClasses={`${style.fill} ${style.border} ${style.ring} ${dimmed}`}
    >
      <div className="flex flex-col items-center">
        <span className={`${BOX_VALUE_TEXT_CLASS} ${style.text}`}>{data.index}</span>
        {data.collisionCount > 1 && (
          <span className="text-[10px] text-slate-400">({data.collisionCount})</span>
        )}
      </div>
    </BoxCellShell>
  );
}

export const hashBucketNodeTypes = { hashBucketNode: HashBucketFlowNode };
