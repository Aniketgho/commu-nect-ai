import { X } from 'lucide-react';
import { Node } from 'reactflow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NodeConfigPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Record<string, any>) => void;
}

const NodeConfigPanel = ({ node, onClose, onUpdate }: NodeConfigPanelProps) => {
  if (!node) return null;

  const handleChange = (key: string, value: any) => {
    onUpdate(node.id, { ...node.data, [key]: value });
  };

  const renderConfig = () => {
    switch (node.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="triggerType">Trigger Type</Label>
              <Select
                value={node.data.triggerType || 'keyword'}
                onValueChange={(v) => handleChange('triggerType', v)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keyword">Keyword Match</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="new_lead">New Lead</SelectItem>
                  <SelectItem value="button_click">Button Click</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {node.data.triggerType === 'keyword' && (
              <div>
                <Label htmlFor="keywords">Keywords (comma separated)</Label>
                <Input
                  id="keywords"
                  className="mt-1.5"
                  placeholder="hello, hi, start"
                  value={node.data.keywords || ''}
                  onChange={(e) => handleChange('keywords', e.target.value)}
                />
              </div>
            )}
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="conditionType">Condition Type</Label>
              <Select
                value={node.data.conditionType || 'text_contains'}
                onValueChange={(v) => handleChange('conditionType', v)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text_contains">Text Contains</SelectItem>
                  <SelectItem value="crm_field">CRM Field</SelectItem>
                  <SelectItem value="tag_exists">Has Tag</SelectItem>
                  <SelectItem value="time_based">Time Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="conditionValue">Value</Label>
              <Input
                id="conditionValue"
                className="mt-1.5"
                placeholder="Enter condition value"
                value={node.data.conditionValue || ''}
                onChange={(e) => handleChange('conditionValue', e.target.value)}
              />
            </div>
          </div>
        );

      case 'delay':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="delayDuration">Duration</Label>
              <div className="flex gap-2 mt-1.5">
                <Input
                  id="delayDuration"
                  type="number"
                  min={1}
                  value={node.data.delayValue || 5}
                  onChange={(e) => handleChange('delayValue', parseInt(e.target.value))}
                  className="flex-1"
                />
                <Select
                  value={node.data.delayUnit || 'minutes'}
                  onValueChange={(v) => handleChange('delayUnit', v)}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="actionType">Action Type</Label>
              <Select
                value={node.data.actionType || 'send_message'}
                onValueChange={(v) => handleChange('actionType', v)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send_message">Send Message</SelectItem>
                  <SelectItem value="assign_agent">Assign Agent</SelectItem>
                  <SelectItem value="update_crm">Update CRM</SelectItem>
                  <SelectItem value="webhook">Trigger Webhook</SelectItem>
                  <SelectItem value="send_email">Send Email</SelectItem>
                  <SelectItem value="ai_response">AI Response</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {node.data.actionType === 'send_message' && (
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  className="mt-1.5 min-h-[100px]"
                  placeholder="Enter your message..."
                  value={node.data.message || ''}
                  onChange={(e) => handleChange('message', e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use {'{name}'}, {'{phone}'} for personalization
                </p>
              </div>
            )}
            {node.data.actionType === 'webhook' && (
              <div>
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  className="mt-1.5"
                  placeholder="https://..."
                  value={node.data.webhookUrl || ''}
                  onChange={(e) => handleChange('webhookUrl', e.target.value)}
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const typeColors: Record<string, string> = {
    trigger: 'emerald',
    condition: 'amber',
    delay: 'purple',
    action: 'blue',
  };

  const color = typeColors[node.type || 'action'];

  return (
    <div className="w-80 bg-card/50 backdrop-blur-sm border-l border-border/50 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Configure Node</h3>
          <p className={`text-xs text-${color}-400 capitalize`}>{node.type}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="label">Node Label</Label>
          <Input
            id="label"
            className="mt-1.5"
            value={node.data.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
          />
        </div>

        {renderConfig()}

        <Button variant="destructive" size="sm" className="w-full mt-6">
          Delete Node
        </Button>
      </div>
    </div>
  );
};

export default NodeConfigPanel;
