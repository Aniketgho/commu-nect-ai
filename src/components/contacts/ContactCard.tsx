import { Contact } from "@/types/contacts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, MoreVertical, Phone, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContactCardProps {
  contact: Contact;
  onSelect: (contact: Contact) => void;
  onMessage: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

const ContactCard = ({ contact, onSelect, onMessage, onEdit, onDelete }: ContactCardProps) => {
  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'inactive': return 'bg-muted-foreground';
      case 'blocked': return 'bg-destructive';
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div 
      className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => onSelect(contact)}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(contact.status)}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-foreground truncate">{contact.name}</h3>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {contact.phone}
            </span>
            {contact.email && (
              <span className="flex items-center gap-1 truncate">
                <Mail className="h-3 w-3" />
                {contact.email}
              </span>
            )}
          </div>
          {contact.lastMessage && (
            <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {contact.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {contact.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{contact.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {contact.lastMessageTime && (
            <span className="text-xs text-muted-foreground">{formatTime(contact.lastMessageTime)}</span>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onMessage(contact)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onMessage(contact)}>
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(contact)}>
                Edit Contact
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(contact)}
                className="text-destructive focus:text-destructive"
              >
                Delete Contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
