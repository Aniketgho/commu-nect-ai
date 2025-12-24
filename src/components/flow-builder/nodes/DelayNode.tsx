import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Clock } from 'lucide-react';

interface DelayNodeData {
  label: string;
  delay?: string;
}

const DelayNode = ({ data, selected }: NodeProps<DelayNodeData>) => {
  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 bg-gradient-to-br from-purple-500/20 to-violet-600/10 backdrop-blur-sm min-w-[180px] transition-all ${
        selected ? 'border-purple-400 shadow-lg shadow-purple-500/20' : 'border-purple-500/30'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-background"
      />
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-purple-400/70 font-medium">
            Delay
          </div>
          <div className="text-sm font-medium text-foreground">{data.label}</div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-background"
      />
    </div>
  );
};

export default memo(DelayNode);
