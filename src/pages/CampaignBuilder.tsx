import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TemplateCard from "@/components/campaigns/TemplateCard";
import TemplateEditor from "@/components/campaigns/TemplateEditor";
import AudienceSelector from "@/components/campaigns/AudienceSelector";
import CampaignScheduler, { ScheduleData } from "@/components/campaigns/CampaignScheduler";
import CampaignAnalytics from "@/components/campaigns/CampaignAnalytics";
import CampaignCard from "@/components/campaigns/CampaignCard";
import {
  Campaign,
  MessageTemplate,
  AudienceSegment,
  mockTemplates,
  mockCampaigns,
} from "@/types/campaigns";
import {
  Plus,
  Search,
  FileText,
  Send,
  BarChart3,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

type WizardStep = 'template' | 'audience' | 'schedule';

const CampaignBuilder = () => {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [templates, setTemplates] = useState<MessageTemplate[]>(mockTemplates);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  
  // Template editor state
  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Campaign creation wizard state
  const [isCreating, setIsCreating] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>('template');
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    description: '',
    template: null as MessageTemplate | null,
    audience: null as AudienceSegment | null,
  });

  // Analytics view state
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.bodyText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCampaign = () => {
    setIsCreating(true);
    setWizardStep('template');
    setNewCampaign({ name: '', description: '', template: null, audience: null });
  };

  const handleScheduleCampaign = (scheduleData: ScheduleData) => {
    if (!newCampaign.template || !newCampaign.audience) return;

    const campaign: Campaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      description: newCampaign.description,
      templateId: newCampaign.template.id,
      template: newCampaign.template,
      audienceId: newCampaign.audience.id,
      audience: newCampaign.audience,
      status: scheduleData.type === 'immediate' ? 'running' : 'scheduled',
      scheduledAt: scheduleData.type === 'scheduled' && scheduleData.date
        ? new Date(`${scheduleData.date.toDateString()} ${scheduleData.time}`).toISOString()
        : new Date().toISOString(),
      analytics: { sent: 0, delivered: 0, read: 0, replied: 0, clicked: 0, failed: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCampaigns([campaign, ...campaigns]);
    setIsCreating(false);
    setActiveTab('campaigns');
    toast.success(
      scheduleData.type === 'immediate'
        ? 'Campaign launched successfully!'
        : 'Campaign scheduled successfully!'
    );
  };

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setIsTemplateEditorOpen(true);
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setIsTemplateEditorOpen(true);
  };

  const handleDuplicateTemplate = (template: MessageTemplate) => {
    const duplicated: MessageTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name}_copy`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates([duplicated, ...templates]);
    toast.success('Template duplicated successfully');
  };

  const handleDeleteTemplate = (template: MessageTemplate) => {
    setTemplates(templates.filter((t) => t.id !== template.id));
    toast.success('Template deleted');
  };

  const handleSaveTemplate = (templateData: Partial<MessageTemplate>) => {
    if (editingTemplate) {
      setTemplates(
        templates.map((t) =>
          t.id === editingTemplate.id ? { ...t, ...templateData } as MessageTemplate : t
        )
      );
      toast.success('Template updated successfully');
    } else {
      setTemplates([templateData as MessageTemplate, ...templates]);
      toast.success('Template submitted for approval');
    }
  };

  const renderWizardStep = () => {
    switch (wizardStep) {
      case 'template':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input
                placeholder="e.g., Summer Sale Announcement"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                placeholder="Describe your campaign"
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <Label>Select Template</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.filter(t => t.status === 'approved').map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    selectable
                    selected={newCampaign.template?.id === template.id}
                    onSelect={(t) => setNewCampaign({ ...newCampaign, template: t })}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setWizardStep('audience')}
                disabled={!newCampaign.name || !newCampaign.template}
              >
                Next: Select Audience <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'audience':
        return (
          <div className="space-y-6">
            <AudienceSelector
              selectedAudience={newCampaign.audience}
              onSelect={(audience) => setNewCampaign({ ...newCampaign, audience })}
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setWizardStep('template')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={() => setWizardStep('schedule')}
                disabled={!newCampaign.audience}
              >
                Next: Schedule <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="font-semibold text-foreground">Campaign Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Template:</span>
                  <p className="font-medium text-foreground">{newCampaign.template?.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Audience:</span>
                  <p className="font-medium text-foreground">
                    {newCampaign.audience?.name} ({newCampaign.audience?.contactCount.toLocaleString()} contacts)
                  </p>
                </div>
              </div>
            </div>
            <CampaignScheduler onSchedule={handleScheduleCampaign} />
            <Button variant="outline" onClick={() => setWizardStep('audience')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        );
    }
  };

  if (selectedCampaign) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => setSelectedCampaign(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
          </Button>
          <CampaignAnalytics campaign={selectedCampaign} />
        </div>
      </DashboardLayout>
    );
  }

  if (isCreating) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setIsCreating(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create Campaign</h1>
              <p className="text-muted-foreground">
                Step {wizardStep === 'template' ? 1 : wizardStep === 'audience' ? 2 : 3} of 3
              </p>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {['template', 'audience', 'schedule'].map((step, index) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full ${
                  (wizardStep === 'template' && index === 0) ||
                  (wizardStep === 'audience' && index <= 1) ||
                  (wizardStep === 'schedule' && index <= 2)
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {renderWizardStep()}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Campaign Builder</h1>
            <p className="text-muted-foreground">
              Create and manage your WhatsApp broadcast campaigns
            </p>
          </div>
          <Button onClick={handleCreateCampaign}>
            <Plus className="mr-2 h-4 w-4" /> Create Campaign
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Send className="h-4 w-4" /> Campaigns
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Templates
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab}...`}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <TabsContent value="campaigns" className="mt-0">
              {filteredCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onView={handleViewCampaign}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">No campaigns yet</h3>
                  <p className="text-muted-foreground">
                    Create your first campaign to start broadcasting
                  </p>
                  <Button className="mt-4" onClick={handleCreateCampaign}>
                    <Plus className="mr-2 h-4 w-4" /> Create Campaign
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="templates" className="mt-0">
              <div className="flex justify-end mb-4">
                <Button onClick={handleCreateTemplate}>
                  <Plus className="mr-2 h-4 w-4" /> Create Template
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={handleEditTemplate}
                    onDuplicate={handleDuplicateTemplate}
                    onDelete={handleDeleteTemplate}
                  />
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <TemplateEditor
          open={isTemplateEditorOpen}
          onOpenChange={setIsTemplateEditorOpen}
          template={editingTemplate}
          onSave={handleSaveTemplate}
        />
      </div>
    </DashboardLayout>
  );
};

export default CampaignBuilder;
