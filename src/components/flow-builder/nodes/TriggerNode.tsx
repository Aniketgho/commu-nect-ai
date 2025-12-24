import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Zap, MessageSquare, Webhook, UserPlus } from 'lucide-react';

const triggerIcons: Record<string, React.ReactNode> = {
  keyword: <MessageSquare className="w-4 h-4" />,
  webhook: <Webhook className="w-4 h-4" />,
  new_lead: <UserPlus className="w-4 h-4" />,
  default: <Zap className="w-4 h-4" />,
};

interface TriggerNodeData {
  label: string;
  triggerType?: string;
  config?: Record<string, any>;
}

const TriggerNode = ({ data, selected }: NodeProps<TriggerNodeData>) => {
  const icon = triggerIcons[data.triggerType || 'default'] || triggerIcons.default;

  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 backdrop-blur-sm min-w-[180px] transition-all ${
        selected ? 'border-emerald-400 shadow-lg shadow-emerald-500/20' : 'border-emerald-500/30'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
          {icon}
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-emerald-400/70 font-medium">
            Trigger
          </div>
          <div className="text-sm font-medium text-foreground">{data.label}</div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-background"
      />
    </div>
  );
};

export default memo(TriggerNode);
