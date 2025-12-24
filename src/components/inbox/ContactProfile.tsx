import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Tag,
  MessageSquare,
  ShoppingCart,
  Clock,
  Edit2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  status: "online" | "offline" | "away";
  tags: string[];
  assignedTo?: string;
  createdAt?: string;
  lastActive?: string;
  totalConversations?: number;
  totalOrders?: number;
  notes?: string;
}

interface ContactProfileProps {
  contact: Contact | null;
  onClose: () => void;
}

const ContactProfile = ({ contact, onClose }: ContactProfileProps) => {
  if (!contact) return null;

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Contact Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Profile Header */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-foreground font-bold text-xl mx-auto mb-3">
              {contact.name.slice(0, 2).toUpperCase()}
            </div>
            <h4 className="font-semibold text-foreground text-lg">
              {contact.name}
            </h4>
            <p className="text-sm text-muted-foreground">{contact.phone}</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  contact.status === "online"
                    ? "bg-primary"
                    : contact.status === "away"
                    ? "bg-yellow-500"
                    : "bg-muted-foreground/40"
                }`}
              />
              <span className="text-xs text-muted-foreground capitalize">
                {contact.status}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" size="sm">
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-foreground">Information</h5>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{contact.phone}</span>
              </div>
              {contact.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{contact.email}</span>
                </div>
              )}
              {contact.location && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{contact.location}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Added {contact.createdAt || "Dec 15, 2024"}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium text-foreground">Tags</h5>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <Tag className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {contact.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Stats */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-foreground">Activity</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="text-xs">Conversations</span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {contact.totalConversations || 12}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span className="text-xs">Orders</span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {contact.totalOrders || 3}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Last active {contact.lastActive || "2 hours ago"}</span>
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-medium text-foreground">Notes</h5>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                Edit
              </Button>
            </div>
            <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground">
              {contact.notes ||
                "No notes added yet. Click edit to add internal notes about this contact."}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ContactProfile;
