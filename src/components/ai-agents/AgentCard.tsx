import { Bot, MoreVertical, Play, Pause, Settings, Trash2, Copy, MessageSquare, Key, AlertCircle } from 'lucide-react';
import { AIAgent, agentTypeConfig } from '@/types/aiAgents';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AgentCardProps {
  agent: AIAgent;
  onSelect: (agent: AIAgent) => void;
  onToggleStatus: (agent: AIAgent) => void;
  onDelete: (agent: AIAgent) => void;
  onDuplicate: (agent: AIAgent) => void;
}

const AgentCard = ({ agent, onSelect, onToggleStatus, onDelete, onDuplicate }: AgentCardProps) => {
  const config = agentTypeConfig[agent.type];
  const Icon = config.icon;

  const statusColors = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    inactive: 'bg-muted text-muted-foreground border-border',
    draft: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  return (
    <div
      className="group relative p-5 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card/80 transition-all cursor-pointer"
      onClick={() => onSelect(agent)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg bg-${config.color}-500/20`}>
            <Icon className={`w-5 h-5 text-${config.color}-400`} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {agent.name}
            </h3>
            <p className="text-xs text-muted-foreground">{config.label}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className={statusColors[agent.status]}>
            {agent.status}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelect(agent); }}>
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onToggleStatus(agent); }}>
                {agent.status === 'active' ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(agent); }}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onDelete(agent); }}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {agent.description}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MessageSquare className="w-4 h-4" />
          <span>{agent.conversations.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Success:</span>
          <span className={agent.successRate >= 80 ? 'text-emerald-400' : agent.successRate >= 60 ? 'text-amber-400' : 'text-muted-foreground'}>
            {agent.successRate}%
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span>{agent.languages.length} lang{agent.languages.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* API & Knowledge Base Indicator */}
      <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs">
          {agent.knowledgeBase.length > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Bot className="w-3.5 h-3.5" />
              <span>{agent.knowledgeBase.length} source{agent.knowledgeBase.length > 1 ? 's' : ''}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="capitalize">{agent.apiConfig.provider}</span>
          </div>
        </div>
        {!agent.apiConfig.isKeySet && (
          <div className="flex items-center gap-1 text-xs text-amber-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>API key needed</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentCard;
