import { LeadStage, Tag } from '@/types/crm';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface LeadFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStage: string;
  onStageChange: (stage: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  stages: LeadStage[];
  tags: Tag[];
}

export function LeadFilters({
  searchQuery,
  onSearchChange,
  selectedStage,
  onStageChange,
  selectedTags,
  onTagsChange,
  stages,
  tags,
}: LeadFiltersProps) {
  const activeFilters = (selectedStage !== 'all' ? 1 : 0) + (selectedTags.length > 0 ? 1 : 0);

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const clearFilters = () => {
    onStageChange('all');
    onTagsChange([]);
    onSearchChange('');
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search leads..."
          className="pl-9"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Stage Filter */}
      <Select value={selectedStage} onValueChange={onStageChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Stages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stages</SelectItem>
          {stages.map((stage) => (
            <SelectItem key={stage.id} value={stage.id}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                {stage.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Tags Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Tags
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {selectedTags.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="start">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Filter by Tags</Label>
            <div className="space-y-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={() => toggleTag(tag.id)}
                  />
                  <label
                    htmlFor={`tag-${tag.id}`}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                    {tag.name}
                  </label>
                </div>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => onTagsChange([])}
              >
                Clear Tags
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear All */}
      {activeFilters > 0 && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
          <X className="h-4 w-4 mr-1" />
          Clear all
        </Button>
      )}
    </div>
  );
}
