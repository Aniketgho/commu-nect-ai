import { useState } from 'react';
import { Lead, LeadStage, Tag, CustomField } from '@/types/crm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TagsManager } from './TagsManager';
import { LeadNotesSection } from './LeadNotesSection';
import { 
  Mail, Phone, Building2, Globe, Calendar, 
  Edit2, Save, X, Trash2, ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';

interface LeadDetailsPanelProps {
  lead: Lead | null;
  stages: LeadStage[];
  tags: Tag[];
  customFields: CustomField[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onCreateTag: (tag: Omit<Tag, 'id'>) => void;
}

export function LeadDetailsPanel({
  lead,
  stages,
  tags,
  customFields,
  isOpen,
  onClose,
  onUpdateLead,
  onDeleteLead,
  onCreateTag,
}: LeadDetailsPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Lead | null>(null);

  if (!lead) return null;

  const stage = stages.find(s => s.id === lead.stageId);
  const leadTags = tags.filter(t => lead.tags.includes(t.id));
  const initials = lead.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const startEditing = () => {
    setEditData({ ...lead });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditData(null);
    setIsEditing(false);
  };

  const saveChanges = () => {
    if (editData) {
      onUpdateLead({ ...editData, updatedAt: new Date() });
      setIsEditing(false);
      setEditData(null);
    }
  };

  const updateEditField = (field: string, value: any) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
  };

  const updateCustomField = (fieldName: string, value: any) => {
    if (editData) {
      setEditData({
        ...editData,
        customFields: { ...editData.customFields, [fieldName]: value },
      });
    }
  };

  const handleAddNote = (content: string) => {
    const newNote = {
      id: Date.now().toString(),
      leadId: lead.id,
      content,
      createdAt: new Date(),
      createdBy: 'Current User',
    };
    onUpdateLead({
      ...lead,
      notes: [...lead.notes, newNote],
      updatedAt: new Date(),
    });
  };

  const data = isEditing ? editData! : lead;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                {isEditing ? (
                  <Input
                    value={data.name}
                    onChange={(e) => updateEditField('name', e.target.value)}
                    className="font-semibold text-lg h-8 mb-1"
                  />
                ) : (
                  <SheetTitle className="text-left">{data.name}</SheetTitle>
                )}
                {data.company && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    {data.company}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              {isEditing ? (
                <>
                  <Button variant="ghost" size="icon" onClick={cancelEditing}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={saveChanges}>
                    <Save className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="icon" onClick={startEditing}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      onDeleteLead(lead.id);
                      onClose();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="notes">Notes ({lead.notes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-4">
            {/* Stage */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Stage</Label>
              {isEditing ? (
                <Select value={data.stageId} onValueChange={(v) => updateEditField('stageId', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                          {s.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge 
                  variant="outline" 
                  className="text-sm"
                  style={{ borderColor: stage?.color, color: stage?.color }}
                >
                  {stage?.name}
                </Badge>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Contact</Label>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      type="email"
                      value={data.email}
                      onChange={(e) => updateEditField('email', e.target.value)}
                      className="h-8"
                    />
                  ) : (
                    <a href={`mailto:${data.email}`} className="text-sm text-primary hover:underline">
                      {data.email}
                    </a>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={data.phone}
                      onChange={(e) => updateEditField('phone', e.target.value)}
                      className="h-8"
                    />
                  ) : (
                    <span className="text-sm">{data.phone || '-'}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {isEditing ? (
                    <Input
                      value={data.company || ''}
                      onChange={(e) => updateEditField('company', e.target.value)}
                      className="h-8"
                      placeholder="Company name"
                    />
                  ) : (
                    <span className="text-sm">{data.company || '-'}</span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Tags</Label>
              {isEditing ? (
                <TagsManager
                  allTags={tags}
                  selectedTags={data.tags}
                  onTagsChange={(t) => updateEditField('tags', t)}
                  onCreateTag={onCreateTag}
                />
              ) : (
                <div className="flex flex-wrap gap-1">
                  {leadTags.length > 0 ? (
                    leadTags.map(tag => (
                      <Badge 
                        key={tag.id} 
                        variant="secondary"
                        style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No tags</span>
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Custom Fields */}
            {customFields.length > 0 && (
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Custom Fields</Label>
                <div className="grid grid-cols-2 gap-3">
                  {customFields.map((field) => (
                    <div key={field.id} className="space-y-1">
                      <Label className="text-xs text-muted-foreground">{field.name}</Label>
                      {isEditing ? (
                        field.type === 'select' ? (
                          <Select
                            value={data.customFields[field.name] || ''}
                            onValueChange={(v) => updateCustomField(field.name, v)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type={field.type === 'number' ? 'number' : 'text'}
                            value={data.customFields[field.name] || ''}
                            onChange={(e) => updateCustomField(field.name, e.target.value)}
                            className="h-8"
                          />
                        )
                      ) : (
                        <p className="text-sm">
                          {field.type === 'number' && data.customFields[field.name]
                            ? `$${Number(data.customFields[field.name]).toLocaleString()}`
                            : data.customFields[field.name] || '-'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Metadata */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Info</Label>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Source</span>
                  <p>{data.source || '-'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Created</span>
                  <p>{format(data.createdAt, 'MMM d, yyyy')}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <LeadNotesSection notes={lead.notes} onAddNote={handleAddNote} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
