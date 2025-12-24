import { useState } from 'react';
import { CustomField } from '@/types/crm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, Settings2 } from 'lucide-react';

interface CustomFieldsManagerProps {
  fields: CustomField[];
  onFieldsChange: (fields: CustomField[]) => void;
}

const fieldTypes: { value: CustomField['type']; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'url', label: 'URL' },
  { value: 'select', label: 'Dropdown' },
  { value: 'multiselect', label: 'Multi-select' },
];

export function CustomFieldsManager({ fields, onFieldsChange }: CustomFieldsManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: '',
    type: 'text',
    required: false,
    options: [],
  });
  const [optionInput, setOptionInput] = useState('');

  const handleAddField = () => {
    if (newField.name && newField.type) {
      const field: CustomField = {
        id: Date.now().toString(),
        name: newField.name,
        type: newField.type,
        required: newField.required || false,
        options: newField.options,
        order: fields.length + 1,
      };
      onFieldsChange([...fields, field]);
      setNewField({ name: '', type: 'text', required: false, options: [] });
      setOptionInput('');
    }
  };

  const handleDeleteField = (fieldId: string) => {
    onFieldsChange(fields.filter(f => f.id !== fieldId));
  };

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setNewField({
        ...newField,
        options: [...(newField.options || []), optionInput.trim()],
      });
      setOptionInput('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setNewField({
      ...newField,
      options: newField.options?.filter((_, i) => i !== index),
    });
  };

  const needsOptions = newField.type === 'select' || newField.type === 'multiselect';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          Manage Fields
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Custom Fields</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing fields */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Fields</Label>
            {fields.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No custom fields defined yet.
              </p>
            ) : (
              <div className="space-y-2">
                {fields.map((field) => (
                  <Card key={field.id} className="border-border/50">
                    <CardContent className="p-3 flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{field.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {fieldTypes.find(t => t.value === field.type)?.label}
                          </Badge>
                          {field.required && (
                            <Badge variant="outline" className="text-xs text-destructive border-destructive">
                              Required
                            </Badge>
                          )}
                        </div>
                        {field.options && field.options.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {field.options.map((opt, i) => (
                              <span key={i} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {opt}
                              </span>
                            ))
                            }
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteField(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Add new field */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <Label className="text-sm font-medium">Add New Field</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Field Name</Label>
                <Input
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  placeholder="e.g., Company Size"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Field Type</Label>
                <Select
                  value={newField.type}
                  onValueChange={(value: CustomField['type']) => 
                    setNewField({ ...newField, type: value, options: [] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {needsOptions && (
              <div className="space-y-2">
                <Label className="text-xs">Options</Label>
                <div className="flex gap-2">
                  <Input
                    value={optionInput}
                    onChange={(e) => setOptionInput(e.target.value)}
                    placeholder="Add option"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                  />
                  <Button type="button" variant="outline" onClick={handleAddOption}>
                    Add
                  </Button>
                </div>
                {newField.options && newField.options.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newField.options.map((opt, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {opt}
                        <button
                          onClick={() => handleRemoveOption(i)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={newField.required}
                  onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                />
                <Label className="text-sm">Required field</Label>
              </div>
              <Button onClick={handleAddField} disabled={!newField.name}>
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
