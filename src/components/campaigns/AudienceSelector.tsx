import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AudienceSegment, SegmentFilter, mockSegments } from "@/types/campaigns";
import { Users, Plus, Filter, X, Check } from "lucide-react";

interface AudienceSelectorProps {
  selectedAudience: AudienceSegment | null;
  onSelect: (audience: AudienceSegment) => void;
}

const filterFields = [
  { value: 'lifetime_value', label: 'Lifetime Value' },
  { value: 'last_active_days', label: 'Last Active (days)' },
  { value: 'total_orders', label: 'Total Orders' },
  { value: 'tags', label: 'Tags' },
  { value: 'city', label: 'City' },
  { value: 'country', label: 'Country' },
];

const filterOperators = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
];

const AudienceSelector = ({ selectedAudience, onSelect }: AudienceSelectorProps) => {
  const [segments] = useState<AudienceSegment[]>(mockSegments);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSegment, setNewSegment] = useState({
    name: '',
    description: '',
    filters: [] as SegmentFilter[],
  });

  const addFilter = () => {
    setNewSegment({
      ...newSegment,
      filters: [
        ...newSegment.filters,
        { field: 'lifetime_value', operator: 'greater_than' as const, value: '' },
      ],
    });
  };

  const removeFilter = (index: number) => {
    setNewSegment({
      ...newSegment,
      filters: newSegment.filters.filter((_, i) => i !== index),
    });
  };

  const updateFilter = (index: number, updates: Partial<SegmentFilter>) => {
    const updatedFilters = [...newSegment.filters];
    updatedFilters[index] = { ...updatedFilters[index], ...updates };
    setNewSegment({ ...newSegment, filters: updatedFilters });
  };

  const createSegment = () => {
    const segment: AudienceSegment = {
      id: Date.now().toString(),
      name: newSegment.name,
      description: newSegment.description,
      filters: newSegment.filters,
      contactCount: Math.floor(Math.random() * 5000) + 100,
      createdAt: new Date().toISOString(),
    };
    onSelect(segment);
    setIsCreateOpen(false);
    setNewSegment({ name: '', description: '', filters: [] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Select Audience</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Create Segment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Segment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Segment Name</Label>
                <Input
                  placeholder="e.g., High Value Customers"
                  value={newSegment.name}
                  onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Input
                  placeholder="Describe this segment"
                  value={newSegment.description}
                  onChange={(e) => setNewSegment({ ...newSegment, description: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Filters</Label>
                  <Button variant="ghost" size="sm" onClick={addFilter}>
                    <Filter className="h-4 w-4 mr-1" /> Add Filter
                  </Button>
                </div>
                {newSegment.filters.map((filter, index) => (
                  <div key={index} className="flex gap-2 items-center p-3 bg-muted/50 rounded-lg">
                    <Select
                      value={filter.field}
                      onValueChange={(value) => updateFilter(index, { field: value })}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filterFields.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={filter.operator}
                      onValueChange={(value) => updateFilter(index, { operator: value as SegmentFilter['operator'] })}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOperators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      className="flex-1"
                      placeholder="Value"
                      value={String(filter.value)}
                      onChange={(e) => updateFilter(index, { value: e.target.value })}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeFilter(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button className="w-full" onClick={createSegment} disabled={!newSegment.name}>
                Create Segment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {segments.map((segment) => (
          <Card
            key={segment.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedAudience?.id === segment.id ? 'ring-2 ring-primary border-primary' : ''
            }`}
            onClick={() => onSelect(segment)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  {segment.name}
                </CardTitle>
                {selectedAudience?.id === segment.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{segment.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">
                  {segment.contactCount.toLocaleString()} contacts
                </Badge>
                {segment.filters.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {segment.filters.length} filter{segment.filters.length > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AudienceSelector;
