import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Contact, Tag } from "@/types/contacts";
import { X, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
  availableTags: Tag[];
  editContact?: Contact;
}

const AddContactDialog = ({ open, onOpenChange, onAdd, availableTags, editContact }: AddContactDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: editContact?.name || '',
    phone: editContact?.phone || '',
    email: editContact?.email || '',
    status: editContact?.status || 'active' as Contact['status'],
    tags: editContact?.tags || [] as string[],
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      toast.error('Name and phone number are required');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onAdd({
      ...formData,
      tags: formData.tags,
    });
    
    setIsLoading(false);
    onOpenChange(false);
    setFormData({ name: '', phone: '', email: '', status: 'active', tags: [] });
    toast.success(editContact ? 'Contact updated!' : 'Contact added!');
  };

  const toggleTag = (tagName: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter(t => t !== tagName)
        : [...prev.tags, tagName],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editContact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Enter contact name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              placeholder="+1234567890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: Contact['status']) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={formData.tags.includes(tag.name) ? "default" : "outline"}
                  className="cursor-pointer transition-colors"
                  style={{
                    backgroundColor: formData.tags.includes(tag.name) ? tag.color : undefined,
                    borderColor: tag.color,
                  }}
                  onClick={() => toggleTag(tag.name)}
                >
                  {tag.name}
                  {formData.tags.includes(tag.name) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {editContact ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                {editContact ? 'Update Contact' : 'Add Contact'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;
