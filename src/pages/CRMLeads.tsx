import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Lead, LeadStage, Tag, CustomField, defaultStages, defaultTags, defaultCustomFields, mockLeads } from '@/types/crm';
import { LeadCard } from '@/components/crm/LeadCard';
import { LeadDetailsPanel } from '@/components/crm/LeadDetailsPanel';
import { LeadFilters } from '@/components/crm/LeadFilters';
import { AddLeadDialog } from '@/components/crm/AddLeadDialog';
import { CustomFieldsManager } from '@/components/crm/CustomFieldsManager';
import { ImportExportDialog } from '@/components/crm/ImportExportDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Users, TrendingUp, Target, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function CRMLeads() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [stages, setStages] = useState<LeadStage[]>(defaultStages);
  const [tags, setTags] = useState<Tag[]>(defaultTags);
  const [customFields, setCustomFields] = useState<CustomField[]>(defaultCustomFields);
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = searchQuery === '' || 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStage = selectedStage === 'all' || lead.stageId === selectedStage;
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tagId => lead.tags.includes(tagId));
      
      return matchesSearch && matchesStage && matchesTags;
    });
  }, [leads, searchQuery, selectedStage, selectedTags]);

  // Stats
  const stats = useMemo(() => {
    const total = leads.length;
    const qualified = leads.filter(l => ['3', '4', '5'].includes(l.stageId)).length;
    const won = leads.filter(l => l.stageId === '6').length;
    const thisMonth = leads.filter(l => {
      const date = new Date(l.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    
    return { total, qualified, won, thisMonth };
  }, [leads]);

  const handleOpenLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsPanelOpen(true);
  };

  const handleAddLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'notes'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setLeads([newLead, ...leads]);
    toast.success('Lead added successfully');
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
    setSelectedLead(updatedLead);
    toast.success('Lead updated');
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads(leads.filter(l => l.id !== leadId));
    toast.success('Lead deleted');
  };

  const handleCreateTag = (tagData: Omit<Tag, 'id'>) => {
    const newTag: Tag = { ...tagData, id: Date.now().toString() };
    setTags([...tags, newTag]);
    toast.success('Tag created');
  };

  const handleImport = (importedLeads: Partial<Lead>[]) => {
    const newLeads: Lead[] = importedLeads.map((data, i) => ({
      id: `import-${Date.now()}-${i}`,
      name: data.name || 'Unknown',
      email: data.email || '',
      phone: data.phone || '',
      company: data.company,
      stageId: stages[0].id,
      tags: [],
      customFields: data.customFields || {},
      notes: [],
      source: data.source || 'Import',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    setLeads([...newLeads, ...leads]);
  };

  // Group leads by stage for Kanban view
  const leadsByStage = useMemo(() => {
    const grouped: Record<string, Lead[]> = {};
    stages.forEach(stage => {
      grouped[stage.id] = filteredLeads.filter(l => l.stageId === stage.id);
    });
    return grouped;
  }, [filteredLeads, stages]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">CRM & Leads</h1>
            <p className="text-muted-foreground">Manage your leads and customer relationships</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ImportExportDialog 
              leads={leads} 
              customFields={customFields}
              onImport={handleImport}
            />
            <CustomFieldsManager 
              fields={customFields} 
              onFieldsChange={setCustomFields} 
            />
            <AddLeadDialog
              stages={stages}
              tags={tags}
              customFields={customFields}
              onAddLead={handleAddLead}
              onCreateTag={handleCreateTag}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Leads</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Target className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.qualified}</p>
                <p className="text-xs text-muted-foreground">Qualified</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.won}</p>
                <p className="text-xs text-muted-foreground">Won</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.thisMonth}</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <LeadFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStage={selectedStage}
          onStageChange={setSelectedStage}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          stages={stages}
          tags={tags}
        />

        {/* View Toggle */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'kanban')}>
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="kanban">Kanban View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            {filteredLeads.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-foreground mb-1">No leads found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || selectedStage !== 'all' || selectedTags.length > 0
                      ? 'Try adjusting your filters'
                      : 'Add your first lead to get started'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    stages={stages}
                    tags={tags}
                    onClick={() => handleOpenLead(lead)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="kanban" className="mt-4">
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4" style={{ minWidth: stages.length * 280 }}>
                {stages.filter(s => !['6', '7'].includes(s.id) || leadsByStage[s.id].length > 0).map((stage) => (
                  <div 
                    key={stage.id} 
                    className="flex-shrink-0 w-[260px] bg-muted/30 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: stage.color }}
                      />
                      <h3 className="font-medium text-sm">{stage.name}</h3>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {leadsByStage[stage.id].length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {leadsByStage[stage.id].map((lead) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          stages={stages}
                          tags={tags}
                          onClick={() => handleOpenLead(lead)}
                        />
                      ))}
                      {leadsByStage[stage.id].length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No leads in this stage
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Lead Details Panel */}
        <LeadDetailsPanel
          lead={selectedLead}
          stages={stages}
          tags={tags}
          customFields={customFields}
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          onUpdateLead={handleUpdateLead}
          onDeleteLead={handleDeleteLead}
          onCreateTag={handleCreateTag}
        />
      </div>
    </DashboardLayout>
  );
}
