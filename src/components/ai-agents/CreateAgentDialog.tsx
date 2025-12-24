import { useState } from 'react';
import { X, Bot, Sparkles, MessageSquare, Users, Zap, Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AIAgent, agentTypeConfig, modelOptions } from '@/types/aiAgents';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateAgentDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (agent: Partial<AIAgent>) => void;
}

const agentTypes = [
  { type: 'sales', icon: Sparkles, label: 'Sales Bot', description: 'Convert leads and close deals', color: 'emerald' },
  { type: 'support', icon: MessageSquare, label: 'Support Bot', description: 'Handle customer queries', color: 'blue' },
  { type: 'booking', icon: Users, label: 'Booking Assistant', description: 'Schedule appointments', color: 'purple' },
  { type: 'lead_qualification', icon: Zap, label: 'Lead Qualifier', description: 'Qualify and score leads', color: 'amber' },
  { type: 'custom', icon: Brain, label: 'Custom Agent', description: 'Build from scratch', color: 'rose' },
] as const;

const CreateAgentDialog = ({ open, onClose, onCreate }: CreateAgentDialogProps) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<AIAgent['type'] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model: 'gemini-2.5-flash' as AIAgent['model'],
  });

  const handleCreate = () => {
    if (!selectedType) return;
    
    onCreate({
      name: formData.name,
      description: formData.description,
      type: selectedType,
      model: formData.model,
      status: 'draft',
      systemPrompt: '',
      welcomeMessage: 'Hi! How can I help you today?',
      fallbackMessage: 'Let me connect you with a human agent.',
      enableHumanFallback: true,
      languages: ['en'],
      knowledgeBase: [],
      conversations: 0,
      successRate: 0,
    });
    
    // Reset state
    setStep(1);
    setSelectedType(null);
    setFormData({ name: '', description: '', model: 'gemini-2.5-flash' });
    onClose();
  };

  const handleClose = () => {
    setStep(1);
    setSelectedType(null);
    setFormData({ name: '', description: '', model: 'gemini-2.5-flash' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            {step === 1 ? 'Choose Agent Type' : 'Configure Your Agent'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Select the type of AI agent you want to create
            </p>
            <div className="grid grid-cols-2 gap-3">
              {agentTypes.map((agent) => {
                const Icon = agent.icon;
                const isSelected = selectedType === agent.type;
                return (
                  <button
                    key={agent.type}
                    onClick={() => setSelectedType(agent.type)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? `border-${agent.color}-500/50 bg-${agent.color}-500/10`
                        : 'border-border/50 hover:border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${agent.color}-500/20`}>
                        <Icon className={`w-5 h-5 text-${agent.color}-400`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{agent.label}</h4>
                        <p className="text-xs text-muted-foreground">{agent.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedType}
                variant="gradient"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-4">
            <div>
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                placeholder="e.g., Sales Assistant"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this agent does..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1.5 min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="model">AI Model</Label>
              <Select
                value={formData.model}
                onValueChange={(v) => setFormData({ ...formData, model: v as AIAgent['model'] })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{model.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">{model.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!formData.name}
                variant="gradient"
              >
                Create Agent
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateAgentDialog;
