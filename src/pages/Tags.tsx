import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tag, mockTags } from "@/types/contacts";
import { Plus, X, Edit2, Check, Tags as TagsIcon, Users, Search } from "lucide-react";
import { toast } from "sonner";

const TAG_COLORS = [
  '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
];

const Tags = () => {
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [editName, setEditName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTag = () => {
    if (!newTagName.trim()) {
      toast.error('Please enter a tag name');
      return;
    }
    if (tags.some(t => t.name.toLowerCase() === newTagName.toLowerCase())) {
      toast.error('Tag already exists');
      return;
    }
    const newTag: Tag = {
      id: Date.now().toString(),
      name: newTagName.trim().toLowerCase(),
      color: newTagColor,
      contactCount: 0,
    };
    setTags(prev => [...prev, newTag]);
    setNewTagName('');
    setNewTagColor(TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)]);
    setIsAdding(false);
    toast.success('Tag created!');
  };

  const handleEditTag = (id: string) => {
    if (!editName.trim()) {
      toast.error('Please enter a tag name');
      return;
    }
    setTags(prev => prev.map(t => t.id === id ? { ...t, name: editName.trim().toLowerCase() } : t));
    setEditingId(null);
    toast.success('Tag updated!');
  };

  const handleDeleteTag = (id: string, contactCount: number) => {
    if (contactCount > 0) {
      toast.error(`Cannot delete tag with ${contactCount} contacts. Remove contacts first.`);
      return;
    }
    setTags(prev => prev.filter(t => t.id !== id));
    toast.success('Tag deleted!');
  };

  const handleColorChange = (id: string, color: string) => {
    setTags(prev => prev.map(t => t.id === id ? { ...t, color } : t));
  };

  const totalContacts = tags.reduce((sum, tag) => sum + tag.contactCount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tags</h1>
            <p className="text-muted-foreground">Organize your contacts with tags</p>
          </div>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Tag
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TagsIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{tags.length}</p>
                  <p className="text-sm text-muted-foreground">Total Tags</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalContacts}</p>
                  <p className="text-sm text-muted-foreground">Tagged Contacts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <TagsIcon className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {tags.filter(t => t.contactCount > 0).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Tags</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Add New Tag Form */}
        {isAdding && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Create New Tag</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-foreground">Tag Name</label>
                  <Input
                    placeholder="Enter tag name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Color</label>
                  <div className="flex gap-1">
                    {TAG_COLORS.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full transition-transform ${
                          newTagColor === color ? 'scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewTagColor(color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddTag}>
                  <Check className="h-4 w-4 mr-2" /> Create Tag
                </Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTags.length === 0 ? (
            <div className="col-span-full text-center py-12 glass-card">
              <TagsIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-foreground font-medium">No tags found</p>
              <p className="text-sm text-muted-foreground">Create your first tag to organize contacts</p>
            </div>
          ) : (
            filteredTags.map((tag) => (
              <Card key={tag.id} className="border-border hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  {editingId === tag.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEditTag(tag.id)}
                        autoFocus
                      />
                      <div className="flex gap-1">
                        {TAG_COLORS.map((color) => (
                          <button
                            key={color}
                            className={`w-6 h-6 rounded-full transition-transform ${
                              tag.color === color ? 'scale-110 ring-2 ring-foreground ring-offset-1' : ''
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(tag.id, color)}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleEditTag(tag.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: tag.color }}
                        />
                        <div>
                          <Badge variant="secondary" className="font-normal text-sm">
                            {tag.name}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {tag.contactCount} contacts
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingId(tag.id);
                            setEditName(tag.name);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteTag(tag.id, tag.contactCount)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tags;
