import { Zap, GitBranch, Clock, Send, MessageSquare, Webhook, UserPlus, UserCheck, Database, Mail, Bot } from 'lucide-react';

interface NodeTemplate {
  type: string;
  label: string;
  icon: React.ReactNode;
  category: 'trigger' | 'condition' | 'delay' | 'action';
  data?: Record<string, any>;
}

const nodeTemplates: NodeTemplate[] = [
  // Triggers
  { type: 'trigger', label: 'Keyword Match', icon: <MessageSquare className="w-4 h-4" />, category: 'trigger', data: { triggerType: 'keyword' } },
  { type: 'trigger', label: 'Webhook', icon: <Webhook className="w-4 h-4" />, category: 'trigger', data: { triggerType: 'webhook' } },
  { type: 'trigger', label: 'New Lead', icon: <UserPlus className="w-4 h-4" />, category: 'trigger', data: { triggerType: 'new_lead' } },
  { type: 'trigger', label: 'Button Click', icon: <Zap className="w-4 h-4" />, category: 'trigger', data: { triggerType: 'button_click' } },
  // Conditions
  { type: 'condition', label: 'If/Else', icon: <GitBranch className="w-4 h-4" />, category: 'condition' },
  // Delays
  { type: 'delay', label: 'Wait', icon: <Clock className="w-4 h-4" />, category: 'delay' },
  // Actions
  { type: 'action', label: 'Send Message', icon: <Send className="w-4 h-4" />, category: 'action', data: { actionType: 'send_message' } },
  { type: 'action', label: 'Assign Agent', icon: <UserCheck className="w-4 h-4" />, category: 'action', data: { actionType: 'assign_agent' } },
  { type: 'action', label: 'Update CRM', icon: <Database className="w-4 h-4" />, category: 'action', data: { actionType: 'update_crm' } },
  { type: 'action', label: 'Trigger Webhook', icon: <Webhook className="w-4 h-4" />, category: 'action', data: { actionType: 'webhook' } },
  { type: 'action', label: 'Send Email', icon: <Mail className="w-4 h-4" />, category: 'action', data: { actionType: 'send_email' } },
  { type: 'action', label: 'AI Response', icon: <Bot className="w-4 h-4" />, category: 'action', data: { actionType: 'ai_response' } },
];

const categoryColors = {
  trigger: 'emerald',
  condition: 'amber',
  delay: 'purple',
  action: 'blue',
};

const categoryLabels = {
  trigger: 'Triggers',
  condition: 'Conditions',
  delay: 'Timing',
  action: 'Actions',
};

const FlowSidebar = () => {
  const onDragStart = (event: React.DragEvent, node: NodeTemplate) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: node.type,
      label: node.label,
      ...node.data,
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const categories = ['trigger', 'condition', 'delay', 'action'] as const;

  return (
    <div className="w-64 bg-card/50 backdrop-blur-sm border-r border-border/50 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-foreground mb-4">Node Library</h3>
      <p className="text-xs text-muted-foreground mb-6">
        Drag nodes to the canvas to build your automation flow
      </p>

      {categories.map((category) => {
        const nodes = nodeTemplates.filter((n) => n.category === category);
        const color = categoryColors[category];

        return (
          <div key={category} className="mb-6">
            <h4 className={`text-xs uppercase tracking-wider font-medium mb-3 text-${color}-400`}>
              {categoryLabels[category]}
            </h4>
            <div className="space-y-2">
              {nodes.map((node) => (
                <div
                  key={node.label}
                  draggable
                  onDragStart={(e) => onDragStart(e, node)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all hover:scale-[1.02] bg-${color}-500/10 border-${color}-500/30 hover:border-${color}-400/50 hover:bg-${color}-500/20`}
                >
                  <div className={`p-1.5 rounded-md bg-${color}-500/20 text-${color}-400`}>
                    {node.icon}
                  </div>
                  <span className="text-sm font-medium text-foreground">{node.label}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FlowSidebar;
