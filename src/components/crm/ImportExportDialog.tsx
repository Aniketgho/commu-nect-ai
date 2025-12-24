import { useState, useRef } from 'react';
import { Lead, CustomField } from '@/types/crm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImportExportDialogProps {
  leads: Lead[];
  customFields: CustomField[];
  onImport: (leads: Partial<Lead>[]) => void;
}

export function ImportExportDialog({ leads, customFields, onImport }: ImportExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('import');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [exportFields, setExportFields] = useState<string[]>(['name', 'email', 'phone', 'company']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const standardFields = ['name', 'email', 'phone', 'company', 'source'];
  const allExportFields = [...standardFields, ...customFields.map(f => f.name)];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      parseCSV(file);
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      
      const data = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row: Record<string, string> = {};
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });
        return row;
      }).filter(row => Object.values(row).some(v => v));

      setImportPreview(data);
      
      // Auto-map fields
      const mapping: Record<string, string> = {};
      headers.forEach(header => {
        const lowerHeader = header.toLowerCase();
        if (lowerHeader.includes('name') && !lowerHeader.includes('company')) mapping[header] = 'name';
        else if (lowerHeader.includes('email')) mapping[header] = 'email';
        else if (lowerHeader.includes('phone') || lowerHeader.includes('mobile')) mapping[header] = 'phone';
        else if (lowerHeader.includes('company') || lowerHeader.includes('organization')) mapping[header] = 'company';
        else if (lowerHeader.includes('source')) mapping[header] = 'source';
      });
      setFieldMapping(mapping);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!importFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

      const importedLeads: Partial<Lead>[] = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const lead: Partial<Lead> = {
          tags: [],
          customFields: {},
          notes: [],
        };

        headers.forEach((header, i) => {
          const mappedField = fieldMapping[header];
          if (mappedField && values[i]) {
            if (standardFields.includes(mappedField)) {
              (lead as any)[mappedField] = values[i];
            } else {
              lead.customFields![mappedField] = values[i];
            }
          }
        });

        return lead;
      }).filter(lead => lead.name || lead.email);

      onImport(importedLeads);
      toast.success(`Imported ${importedLeads.length} leads successfully`);
      setIsOpen(false);
      setImportFile(null);
      setImportPreview([]);
    };
    reader.readAsText(importFile);
  };

  const handleExport = () => {
    const headers = exportFields.join(',');
    const rows = leads.map(lead => {
      return exportFields.map(field => {
        if (standardFields.includes(field)) {
          return `"${(lead as any)[field] || ''}"`;
        }
        return `"${lead.customFields[field] || ''}"`;
      }).join(',');
    });

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${leads.length} leads`);
    setIsOpen(false);
  };

  const toggleExportField = (field: string) => {
    setExportFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Import/Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import & Export Leads</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="h-4 w-4 mr-2" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-foreground font-medium">
                  {importFile ? importFile.name : 'Click to upload CSV file'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported format: CSV
                </p>
              </div>

              {importPreview.length > 0 && (
                <>
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Found {importPreview.length}+ rows. Map your columns below.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Column Mapping</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.keys(importPreview[0] || {}).map((header) => (
                        <div key={header} className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground flex-1 truncate">{header}</span>
                          <Select
                            value={fieldMapping[header] || 'skip'}
                            onValueChange={(value) => 
                              setFieldMapping({ ...fieldMapping, [header]: value })
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Map to..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="skip">Skip</SelectItem>
                              {standardFields.map(field => (
                                <SelectItem key={field} value={field}>
                                  {field.charAt(0).toUpperCase() + field.slice(1)}
                                </SelectItem>
                              ))}
                              {customFields.map(field => (
                                <SelectItem key={field.id} value={field.name}>
                                  {field.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleImport}>
                      <Upload className="h-4 w-4 mr-2" />
                      Import Leads
                    </Button>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-4 mt-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {leads.length} leads will be exported based on your selection.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Fields to Export</Label>
              <div className="grid grid-cols-2 gap-2">
                {allExportFields.map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={field}
                      checked={exportFields.includes(field)}
                      onCheckedChange={() => toggleExportField(field)}
                    />
                    <label htmlFor={field} className="text-sm cursor-pointer">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleExport} disabled={exportFields.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
