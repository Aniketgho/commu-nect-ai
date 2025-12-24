import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Send, UserCheck, Database, Webhook, Mail, Bot } from 'lucide-react';

const actionIcons: Record<string, React.ReactNode> = {
  send_message: <Send className="w-4 h-4" />,
  assign_agent: <UserCheck className="w-4 h-4" />,
  update_crm: <Database className="w-4 h-4" />,
  webhook: <Webhook className="w-4 h-4" />,
  send_email: <Mail className="w-4 h-4" />,
  ai_response: <Bot className="w-4 h-4" />,
  default: <Send className="w-4 h-4" />,
};

interface ActionNodeData {
  label: string;
  actionType?: string;
  config?: Record<string, any>;
}

const ActionNode = ({ data, selected }: NodeProps<ActionNodeData>) => {
  const icon = actionIcons[data.actionType || 'default'] || actionIcons.default;

  return (
    <div
      className={`px-4 py-3 rounded-xl border-2 bg-gradient-to-br from-blue-500/20 to-cyan-600/10 backdrop-blur-sm min-w-[180px] transition-all ${
        selected ? 'border-blue-400 shadow-lg shadow-blue-500/20' : 'border-blue-500/30'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-background"
      />
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
          {icon}
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-blue-400/70 font-medium">
            Action
          </div>
          <div className="text-sm font-medium text-foreground">{data.label}</div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-background"
      />
    </div>
  );
};

export default memo(ActionNode);
