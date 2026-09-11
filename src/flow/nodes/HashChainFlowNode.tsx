import { type NodeProps } from 'reactflow';
import { NodeShell } from '../NodeShell';
import { getNodeStateStyle } from '../nodeStateStyles';
import type { NodeVisualState } from '../types';

export interface HashChainFlowNodeData {
  key: string | number;
  value?: string | number;
  chainIndex: number;
  state: NodeVisualState;
  radius: number;
}

export function HashChainFlowNode({ data }: NodeProps<HashChainFlowNodeData>) {
  const style = getNodeStateStyle(data.state);
  const size = data.radius * 2;

  return (
    <NodeShell
      className={`rounded-full border-2 ${style.fill} ${style.border} ${style.ring} transition-colors duration-300`}
      style={{ width: size, height: size }}
    >
      <div className="flex flex-col items-center">
        <span className={`font-bold text-xs ${style.text}`}>{data.key}</span>
        {data.value !== undefined && data.chainIndex > 0 && (
          <span className="text-[9px] text-slate-400">{data.value}</span>
        )}
      </div>
      {data.chainIndex > 0 && (
        <span className="absolute -top-4 text-[9px] font-bold text-amber-400 whitespace-nowrap">
          {`c${data.chainIndex}`}
        </span>
      )}
    </NodeShell>
  );
}

export const hashChainNodeTypes = { hashChainNode: HashChainFlowNode };
