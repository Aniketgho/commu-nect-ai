import { useState } from 'react';
import { Tag } from '@/types/crm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { X, Plus, Check } from 'lucide-react';

interface TagsManagerProps {
  allTags: Tag[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onCreateTag?: (tag: Omit<Tag, 'id'>) => void;
  mode?: 'select' | 'manage';
}

const colorOptions = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
  '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6'
];

export function TagsManager({ 
  allTags, 
  selectedTags, 
  onTagsChange, 
  onCreateTag,
  mode = 'select' 
}: TagsManagerProps) {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(colorOptions[0]);
  const [isCreating, setIsCreating] = useState(false);

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const handleCreateTag = () => {
    if (newTagName.trim() && onCreateTag) {
      onCreateTag({ name: newTagName.trim(), color: newTagColor });
      setNewTagName('');
      setNewTagColor(colorOptions[0]);
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);
          return (
            <Badge
              key={tag.id}
              variant={isSelected ? 'default' : 'outline'}
              className="cursor-pointer transition-all"
              style={{
                backgroundColor: isSelected ? tag.color : 'transparent',
                borderColor: tag.color,
                color: isSelected ? 'white' : tag.color,
              }}
              onClick={() => toggleTag(tag.id)}
            >
              {isSelected && <Check className="h-3 w-3 mr-1" />}
              {tag.name}
            </Badge>
          );
        })}
        
        {onCreateTag && (
          <Popover open={isCreating} onOpenChange={setIsCreating}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-6 px-2">
                <Plus className="h-3 w-3 mr-1" />
                New Tag
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="start">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Tag Name</Label>
                  <Input
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Enter tag name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          newTagColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewTagColor(color)}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleCreateTag} disabled={!newTagName.trim()}>
                    Create
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {selectedTags.length > 0 && mode === 'select' && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Selected:</span>
          <div className="flex flex-wrap gap-1">
            {selectedTags.map((tagId) => {
              const tag = allTags.find(t => t.id === tagId);
              if (!tag) return null;
              return (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-xs"
                  style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                >
                  {tag.name}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:opacity-70" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTag(tag.id);
                    }}
                  />
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
