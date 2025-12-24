import { Lead, LeadStage, Tag } from '@/types/crm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface LeadCardProps {
  lead: Lead;
  stages: LeadStage[];
  tags: Tag[];
  onClick: () => void;
}

export function LeadCard({ lead, stages, tags, onClick }: LeadCardProps) {
  const stage = stages.find(s => s.id === lead.stageId);
  const leadTags = tags.filter(t => lead.tags.includes(t.id));
  const initials = lead.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow border-border/50 hover:border-primary/30"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-foreground truncate">{lead.name}</h3>
              {stage && (
                <Badge 
                  variant="outline" 
                  style={{ borderColor: stage.color, color: stage.color }}
                  className="shrink-0"
                >
                  {stage.name}
                </Badge>
              )}
            </div>
            
            {lead.company && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <Building2 className="h-3.5 w-3.5" />
                <span className="truncate">{lead.company}</span>
              </div>
            )}
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span className="truncate max-w-[120px]">{lead.email}</span>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {lead.phone}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex flex-wrap gap-1">
                {leadTags.slice(0, 3).map(tag => (
                  <Badge 
                    key={tag.id} 
                    variant="secondary"
                    className="text-xs px-1.5 py-0"
                    style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {leadTags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    +{leadTags.length - 3}
                  </Badge>
                )}
              </div>
              
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(lead.createdAt, 'MMM d')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
