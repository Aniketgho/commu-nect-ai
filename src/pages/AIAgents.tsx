import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Bot, Search, Filter } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AgentCard from '@/components/ai-agents/AgentCard';
import CreateAgentDialog from '@/components/ai-agents/CreateAgentDialog';
import AgentConfigPanel from '@/components/ai-agents/AgentConfigPanel';
import { AIAgent, mockAgents } from '@/types/aiAgents';
import { toast } from 'sonner';

const AIAgents = () => {
  const [agents, setAgents] = useState<AIAgent[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || agent.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateAgent = (newAgent: Partial<AIAgent>) => {
    const agent: AIAgent = {
      id: `agent_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...newAgent,
    } as AIAgent;
    setAgents([agent, ...agents]);
    toast.success('Agent created successfully!');
  };

  const handleToggleStatus = (agent: AIAgent) => {
    const newStatus = agent.status === 'active' ? 'inactive' : 'active';
    setAgents(agents.map((a) => 
      a.id === agent.id ? { ...a, status: newStatus, updatedAt: new Date() } : a
    ));
    toast.success(`Agent ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  const handleDeleteAgent = (agent: AIAgent) => {
    setAgents(agents.filter((a) => a.id !== agent.id));
    toast.success('Agent deleted');
  };

  const handleDuplicateAgent = (agent: AIAgent) => {
    const duplicate: AIAgent = {
      ...agent,
      id: `agent_${Date.now()}`,
      name: `${agent.name} (Copy)`,
      status: 'draft',
      conversations: 0,
      successRate: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAgents([duplicate, ...agents]);
    toast.success('Agent duplicated');
  };

  const handleSaveAgent = (updatedAgent: AIAgent) => {
    setAgents(agents.map((a) =>
      a.id === updatedAgent.id ? { ...updatedAgent, updatedAt: new Date() } : a
    ));
    setSelectedAgent(null);
  };

  if (selectedAgent) {
    return (
      <AgentConfigPanel
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
        onSave={handleSaveAgent}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>AI Agents - WhatsApp Automation | WhatsFlow</title>
        <meta name="description" content="Create and manage AI-powered WhatsApp chatbots" />
      </Helmet>

      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Agents</h1>
              <p className="text-muted-foreground mt-1">
                Create and manage AI-powered WhatsApp chatbots
              </p>
            </div>
            <Button variant="gradient" onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Agent
            </Button>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'active', 'inactive', 'draft'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          {/* Agents Grid */}
          {filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onSelect={setSelectedAgent}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteAgent}
                  onDuplicate={handleDuplicateAgent}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-border rounded-xl">
              <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery || filterStatus !== 'all' ? 'No agents found' : 'No agents yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first AI agent to automate conversations'}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <Button variant="gradient" onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Agent
                </Button>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>

      <CreateAgentDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreate={handleCreateAgent}
      />
    </>
  );
};

export default AIAgents;
