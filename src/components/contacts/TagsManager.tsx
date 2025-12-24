import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/types/contacts";
import { Plus, X, Edit2, Check, Tags, Users } from "lucide-react";
import { toast } from "sonner";

interface TagsManagerProps {
  tags: Tag[];
  onAddTag: (tag: Omit<Tag, 'id' | 'contactCount'>) => void;
  onEditTag: (id: string, tag: Partial<Tag>) => void;
  onDeleteTag: (id: string) => void;
}

const TAG_COLORS = [
  '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
];

const TagsManager = ({ tags, onAddTag, onEditTag, onDeleteTag }: TagsManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [editName, setEditName] = useState('');

  const handleAddTag = () => {
    if (!newTagName.trim()) {
      toast.error('Please enter a tag name');
      return;
    }
    if (tags.some(t => t.name.toLowerCase() === newTagName.toLowerCase())) {
      toast.error('Tag already exists');
      return;
    }
    onAddTag({ name: newTagName.trim().toLowerCase(), color: newTagColor });
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
    onEditTag(id, { name: editName.trim().toLowerCase() });
    setEditingId(null);
    toast.success('Tag updated!');
  };

  const handleDeleteTag = (id: string, contactCount: number) => {
    if (contactCount > 0) {
      toast.error(`Cannot delete tag with ${contactCount} contacts. Remove contacts first.`);
      return;
    }
    onDeleteTag(id);
    toast.success('Tag deleted!');
  };

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Tags className="h-5 w-5 text-primary" />
          <CardTitle className="text-foreground">Tags</CardTitle>
        </div>
        {!isAdding && (
          <Button size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Tag
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Tag Form */}
        {isAdding && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <Input
              placeholder="Enter tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Color:</span>
              <div className="flex gap-1">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      newTagColor === color ? 'scale-125 ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewTagColor(color)}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddTag}>
                <Check className="h-4 w-4 mr-1" /> Create
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Tags List */}
        <div className="space-y-2">
          {tags.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No tags created yet</p>
          ) : (
            tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                {editingId === tag.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-8 w-40"
                      onKeyDown={(e) => e.key === 'Enter' && handleEditTag(tag.id)}
                    />
                    <Button size="sm" variant="ghost" onClick={() => handleEditTag(tag.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: tag.color }}
                      />
                      <Badge variant="secondary" className="font-normal">
                        {tag.name}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {tag.contactCount}
                      </span>
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
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TagsManager;
