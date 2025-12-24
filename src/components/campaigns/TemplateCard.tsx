import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageTemplate } from "@/types/campaigns";
import { FileText, Image, Video, File, Eye, Edit, Copy, Trash2 } from "lucide-react";

interface TemplateCardProps {
  template: MessageTemplate;
  onSelect?: (template: MessageTemplate) => void;
  onEdit?: (template: MessageTemplate) => void;
  onDuplicate?: (template: MessageTemplate) => void;
  onDelete?: (template: MessageTemplate) => void;
  selectable?: boolean;
  selected?: boolean;
}

const TemplateCard = ({
  template,
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
  selectable = false,
  selected = false,
}: TemplateCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'marketing':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'utility':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'authentication':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getHeaderIcon = () => {
    switch (template.headerType) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'document':
        return <File className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? 'ring-2 ring-primary border-primary' : ''
      } ${selectable ? 'hover:border-primary/50' : ''}`}
      onClick={() => selectable && onSelect?.(template)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getHeaderIcon()}
            <h3 className="font-semibold text-foreground">{template.name}</h3>
          </div>
          <Badge className={getStatusColor(template.status)} variant="outline">
            {template.status}
          </Badge>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge className={getCategoryColor(template.category)} variant="outline">
            {template.category}
          </Badge>
          <Badge variant="outline" className="text-muted-foreground">
            {template.language.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {template.bodyText}
        </p>
        {template.variables.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {template.variables.map((variable, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {`{{${variable}}}`}
              </Badge>
            ))}
          </div>
        )}
        {!selectable && (
          <div className="flex gap-2 pt-2 border-t border-border">
            <Button variant="ghost" size="sm" onClick={() => onEdit?.(template)}>
              <Eye className="h-4 w-4 mr-1" /> Preview
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit?.(template)}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDuplicate?.(template)}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete?.(template)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
