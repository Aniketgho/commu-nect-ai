import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { GitBranch } from 'lucide-react';

interface ConditionNodeData {
  label: string;
  condition?: string;
}

const ConditionNode = ({ data, selected }: NodeProps<ConditionNodeData>) => {
  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 bg-gradient-to-br from-amber-500/20 to-orange-600/10 backdrop-blur-sm min-w-[180px] transition-all ${
        selected ? 'border-amber-400 shadow-lg shadow-amber-500/20' : 'border-amber-500/30'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-amber-500 !border-2 !border-background"
      />
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
          <GitBranch className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-amber-400/70 font-medium">
            Condition
          </div>
          <div className="text-sm font-medium text-foreground">{data.label}</div>
        </div>
      </div>
      <div className="flex justify-between mt-3 text-[10px]">
        <div className="flex flex-col items-center">
          <span className="text-emerald-400 mb-1">Yes</span>
          <Handle
            type="source"
            position={Position.Bottom}
            id="yes"
            className="!relative !transform-none !w-2.5 !h-2.5 !bg-emerald-500 !border-2 !border-background"
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-red-400 mb-1">No</span>
          <Handle
            type="source"
            position={Position.Bottom}
            id="no"
            className="!relative !transform-none !w-2.5 !h-2.5 !bg-red-500 !border-2 !border-background"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ConditionNode);
