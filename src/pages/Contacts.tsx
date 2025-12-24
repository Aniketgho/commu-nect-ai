import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ContactCard from "@/components/contacts/ContactCard";
import AddContactDialog from "@/components/contacts/AddContactDialog";
import TagsManager from "@/components/contacts/TagsManager";
import ImportExportContacts from "@/components/contacts/ImportExportContacts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Contact, Tag, mockContacts, mockTags } from "@/types/contacts";
import { 
  Search, 
  Plus, 
  Upload, 
  Download, 
  Users, 
  Filter,
  X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportExport, setShowImportExport] = useState<'import' | 'export' | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => contact.tags.includes(tag));

    return matchesSearch && matchesStatus && matchesTags;
  });

  const handleAddContact = (newContact: Omit<Contact, 'id' | 'createdAt'>) => {
    if (editingContact) {
      setContacts(prev => prev.map(c => 
        c.id === editingContact.id 
          ? { ...c, ...newContact }
          : c
      ));
    } else {
      const contact: Contact = {
        ...newContact,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setContacts(prev => [contact, ...prev]);
    }
    setEditingContact(undefined);
  };

  const handleDeleteContact = (contact: Contact) => {
    setContacts(prev => prev.filter(c => c.id !== contact.id));
  };

  const handleAddTag = (tag: Omit<Tag, 'id' | 'contactCount'>) => {
    const newTag: Tag = {
      ...tag,
      id: Date.now().toString(),
      contactCount: 0,
    };
    setTags(prev => [...prev, newTag]);
  };

  const handleEditTag = (id: string, updates: Partial<Tag>) => {
    setTags(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleDeleteTag = (id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
  };

  const handleImport = (importedContacts: Omit<Contact, 'id' | 'createdAt'>[]) => {
    const newContacts = importedContacts.map((c, i) => ({
      ...c,
      id: (Date.now() + i).toString(),
      createdAt: new Date(),
    }));
    setContacts(prev => [...newContacts, ...prev]);
  };

  const toggleTagFilter = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const stats = [
    { label: 'Total', value: contacts.length, color: 'text-foreground' },
    { label: 'Active', value: contacts.filter(c => c.status === 'active').length, color: 'text-emerald-500' },
    { label: 'Inactive', value: contacts.filter(c => c.status === 'inactive').length, color: 'text-muted-foreground' },
    { label: 'Blocked', value: contacts.filter(c => c.status === 'blocked').length, color: 'text-destructive' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
            <p className="text-muted-foreground">Manage your contacts and audience</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowImportExport('import')}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" onClick={() => setShowImportExport('export')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tag Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tags:</span>
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                  className="cursor-pointer transition-colors"
                  style={{
                    backgroundColor: selectedTags.includes(tag.name) ? tag.color : undefined,
                    borderColor: tag.color,
                  }}
                  onClick={() => toggleTagFilter(tag.name)}
                >
                  {tag.name}
                  {selectedTags.includes(tag.name) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>

            {/* Contacts */}
            <div className="space-y-3">
              {filteredContacts.length === 0 ? (
                <div className="text-center py-12 glass-card">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-foreground font-medium">No contacts found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new contact</p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onSelect={(c) => console.log('Selected:', c)}
                    onMessage={(c) => console.log('Message:', c)}
                    onEdit={(c) => {
                      setEditingContact(c);
                      setShowAddDialog(true);
                    }}
                    onDelete={handleDeleteContact}
                  />
                ))
              )}
            </div>
          </div>

          {/* Tags Sidebar */}
          <div className="space-y-6">
            <TagsManager
              tags={tags}
              onAddTag={handleAddTag}
              onEditTag={handleEditTag}
              onDeleteTag={handleDeleteTag}
            />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddContactDialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) setEditingContact(undefined);
        }}
        onAdd={handleAddContact}
        availableTags={tags}
        editContact={editingContact}
      />

      {showImportExport && (
        <ImportExportContacts
          open={!!showImportExport}
          onOpenChange={() => setShowImportExport(null)}
          mode={showImportExport}
          contacts={contacts}
          onImport={handleImport}
        />
      )}
    </DashboardLayout>
  );
};

export default Contacts;
