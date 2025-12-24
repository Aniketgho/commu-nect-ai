import { useState } from "react";
import { Search, Filter, MoreVertical, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Contact {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: "online" | "offline" | "away";
  tags: string[];
  assignedTo?: string;
  avatar?: string;
}

interface ContactSidebarProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ContactSidebar = ({
  contacts,
  selectedContact,
  onSelectContact,
  searchQuery,
  onSearchChange,
}: ContactSidebarProps) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "online":
        return "bg-primary";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-muted-foreground/40";
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Conversations</h2>
          <Badge variant="secondary" className="text-xs">
            {contacts.length}
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, phone, message..."
            className="w-full pl-10 pr-10 py-2 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-background transition-colors ${
              filterOpen ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 mt-3">
          <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
            All
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
            Unread
          </button>
          <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
            Assigned
          </button>
        </div>
      </div>

      {/* Contact List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-200 text-left ${
                selectedContact?.id === contact.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-muted"
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-foreground font-semibold text-sm">
                  {contact.avatar || contact.name.slice(0, 2).toUpperCase()}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(
                    contact.status
                  )}`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground truncate text-sm">
                    {contact.name}
                  </span>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {contact.timestamp}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate mb-1.5">
                  {contact.lastMessage}
                </p>
                <div className="flex items-center gap-2">
                  {contact.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 h-4"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {contact.unread > 0 && (
                    <Badge className="ml-auto text-[10px] px-1.5 py-0 h-4 bg-primary text-primary-foreground">
                      {contact.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ContactSidebar;
