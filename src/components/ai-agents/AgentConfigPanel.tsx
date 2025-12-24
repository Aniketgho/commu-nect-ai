import { useState } from 'react';
import { X, Save, Bot, Upload, Trash2, FileText, Link, Globe, User, ArrowLeft } from 'lucide-react';
import { AIAgent, modelOptions, languageOptions, KnowledgeBaseItem } from '@/types/aiAgents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AgentConfigPanelProps {
  agent: AIAgent;
  onClose: () => void;
  onSave: (agent: AIAgent) => void;
}

const AgentConfigPanel = ({ agent, onClose, onSave }: AgentConfigPanelProps) => {
  const [config, setConfig] = useState<AIAgent>(agent);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    onSave(config);
    toast.success('Agent configuration saved!');
  };

  const handleAddKnowledge = (type: 'pdf' | 'url') => {
    const newItem: KnowledgeBaseItem = {
      id: `kb_${Date.now()}`,
      name: type === 'pdf' ? 'New Document.pdf' : 'https://example.com',
      type,
      status: 'processing',
      uploadedAt: new Date(),
    };
    setConfig({ ...config, knowledgeBase: [...config.knowledgeBase, newItem] });
    toast.info(`${type === 'pdf' ? 'Document' : 'URL'} added to knowledge base`);
  };

  const handleRemoveKnowledge = (id: string) => {
    setConfig({
      ...config,
      knowledgeBase: config.knowledgeBase.filter((item) => item.id !== id),
    });
  };

  const toggleLanguage = (lang: string) => {
    if (config.languages.includes(lang)) {
      setConfig({ ...config, languages: config.languages.filter((l) => l !== lang) });
    } else {
      setConfig({ ...config, languages: [...config.languages, lang] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="h-6 w-px bg-border/50" />
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <h1 className="font-semibold text-foreground">{config.name}</h1>
            <Badge variant="outline" className={config.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted'}>
              {config.status}
            </Badge>
          </div>
        </div>
        <Button variant="gradient" size="sm" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </header>

      {/* Content */}
      <div className="flex h-[calc(100vh-56px)]">
        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex">
          <div className="w-56 border-r border-border/50 bg-card/30 p-4">
            <TabsList className="flex flex-col h-auto bg-transparent gap-1">
              <TabsTrigger value="general" className="w-full justify-start px-3 py-2 data-[state=active]:bg-primary/10">
                General Settings
              </TabsTrigger>
              <TabsTrigger value="prompts" className="w-full justify-start px-3 py-2 data-[state=active]:bg-primary/10">
                Prompts & Messages
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="w-full justify-start px-3 py-2 data-[state=active]:bg-primary/10">
                Knowledge Base
              </TabsTrigger>
              <TabsTrigger value="behavior" className="w-full justify-start px-3 py-2 data-[state=active]:bg-primary/10">
                Behavior
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* General Settings */}
            <TabsContent value="general" className="m-0 space-y-6 max-w-2xl">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">General Settings</h2>
                
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="name">Agent Name</Label>
                    <Input
                      id="name"
                      value={config.name}
                      onChange={(e) => setConfig({ ...config, name: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={config.description}
                      onChange={(e) => setConfig({ ...config, description: e.target.value })}
                      className="mt-1.5 min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="model">AI Model</Label>
                    <Select
                      value={config.model}
                      onValueChange={(v) => setConfig({ ...config, model: v as AIAgent['model'] })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {modelOptions.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label} - {model.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Languages</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {languageOptions.map((lang) => (
                        <button
                          key={lang.value}
                          onClick={() => toggleLanguage(lang.value)}
                          className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                            config.languages.includes(lang.value)
                              ? 'bg-primary/20 border-primary/50 text-primary'
                              : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Prompts & Messages */}
            <TabsContent value="prompts" className="m-0 space-y-6 max-w-2xl">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Prompts & Messages</h2>
                
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="systemPrompt">System Prompt</Label>
                    <p className="text-xs text-muted-foreground mt-1 mb-2">
                      Define the agent's personality, behavior, and instructions
                    </p>
                    <Textarea
                      id="systemPrompt"
                      value={config.systemPrompt}
                      onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                      className="min-h-[200px] font-mono text-sm"
                      placeholder="You are a helpful sales assistant for [Company Name]. Your goal is to..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <p className="text-xs text-muted-foreground mt-1 mb-2">
                      First message sent when a conversation starts
                    </p>
                    <Textarea
                      id="welcomeMessage"
                      value={config.welcomeMessage}
                      onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fallbackMessage">Fallback Message</Label>
                    <p className="text-xs text-muted-foreground mt-1 mb-2">
                      Message sent when agent can't handle the query
                    </p>
                    <Textarea
                      id="fallbackMessage"
                      value={config.fallbackMessage}
                      onChange={(e) => setConfig({ ...config, fallbackMessage: e.target.value })}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Knowledge Base */}
            <TabsContent value="knowledge" className="m-0 space-y-6 max-w-2xl">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Knowledge Base</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Add documents, URLs, or text to train your agent on specific knowledge
                </p>

                <div className="flex gap-3 mb-6">
                  <Button variant="outline" onClick={() => handleAddKnowledge('pdf')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                  <Button variant="outline" onClick={() => handleAddKnowledge('url')}>
                    <Link className="w-4 h-4 mr-2" />
                    Add URL
                  </Button>
                </div>

                {config.knowledgeBase.length > 0 ? (
                  <div className="space-y-3">
                    {config.knowledgeBase.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          {item.type === 'url' ? (
                            <Globe className="w-4 h-4 text-blue-400" />
                          ) : (
                            <FileText className="w-4 h-4 text-amber-400" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.name}</p>
                            {item.size && (
                              <p className="text-xs text-muted-foreground">{item.size}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              item.status === 'ready'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : item.status === 'processing'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-destructive/20 text-destructive'
                            }
                          >
                            {item.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveKnowledge(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <Bot className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No knowledge sources added yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload documents or add URLs to train your agent
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Behavior */}
            <TabsContent value="behavior" className="m-0 space-y-6 max-w-2xl">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Behavior Settings</h2>
                
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Human Fallback</p>
                        <p className="text-sm text-muted-foreground">
                          Transfer to human agent when AI can't help
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={config.enableHumanFallback}
                      onCheckedChange={(checked) =>
                        setConfig({ ...config, enableHumanFallback: checked })
                      }
                    />
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                    <h4 className="font-medium text-foreground mb-2">Agent Status</h4>
                    <div className="flex gap-2">
                      {(['active', 'inactive', 'draft'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setConfig({ ...config, status })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                            config.status === status
                              ? status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                : status === 'inactive'
                                ? 'bg-muted text-foreground border border-border'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                              : 'bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentConfigPanel;
