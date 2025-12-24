import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Contact } from "@/types/contacts";
import { Upload, Download, FileSpreadsheet, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ImportExportContactsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'import' | 'export';
  contacts: Contact[];
  onImport: (contacts: Omit<Contact, 'id' | 'createdAt'>[]) => void;
}

const ImportExportContacts = ({ open, onOpenChange, mode, contacts, onImport }: ImportExportContactsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [selectedFields, setSelectedFields] = useState<string[]>(['name', 'phone', 'email', 'tags', 'status']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportFields = [
    { id: 'name', label: 'Name' },
    { id: 'phone', label: 'Phone' },
    { id: 'email', label: 'Email' },
    { id: 'tags', label: 'Tags' },
    { id: 'status', label: 'Status' },
    { id: 'createdAt', label: 'Created Date' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').map(row => 
        row.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
      );
      setCsvData(rows);

      // Auto-detect column mapping
      const headers = rows[0];
      const mapping: Record<string, string> = {};
      headers.forEach((header, index) => {
        const lowerHeader = header.toLowerCase();
        if (lowerHeader.includes('name')) mapping['name'] = index.toString();
        else if (lowerHeader.includes('phone')) mapping['phone'] = index.toString();
        else if (lowerHeader.includes('email')) mapping['email'] = index.toString();
        else if (lowerHeader.includes('tag')) mapping['tags'] = index.toString();
        else if (lowerHeader.includes('status')) mapping['status'] = index.toString();
      });
      setColumnMapping(mapping);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!columnMapping.name || !columnMapping.phone) {
      toast.error('Name and Phone columns are required');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const importedContacts: Omit<Contact, 'id' | 'createdAt'>[] = [];
    
    for (let i = 1; i < csvData.length; i++) {
      const row = csvData[i];
      if (!row[parseInt(columnMapping.name)] || !row[parseInt(columnMapping.phone)]) continue;

      importedContacts.push({
        name: row[parseInt(columnMapping.name)],
        phone: row[parseInt(columnMapping.phone)],
        email: columnMapping.email ? row[parseInt(columnMapping.email)] : undefined,
        tags: columnMapping.tags ? row[parseInt(columnMapping.tags)]?.split(';').filter(Boolean) || [] : [],
        status: (columnMapping.status ? row[parseInt(columnMapping.status)] : 'active') as Contact['status'],
      });
    }

    onImport(importedContacts);
    setIsLoading(false);
    onOpenChange(false);
    toast.success(`Imported ${importedContacts.length} contacts!`);
  };

  const handleExport = () => {
    setIsLoading(true);

    const headers = selectedFields.map(f => exportFields.find(ef => ef.id === f)?.label || f);
    const rows = contacts.map(contact => 
      selectedFields.map(field => {
        if (field === 'tags') return contact.tags.join(';');
        if (field === 'createdAt') return contact.createdAt.toISOString();
        return (contact as any)[field] || '';
      })
    );

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setIsLoading(false);
    onOpenChange(false);
    toast.success(`Exported ${contacts.length} contacts!`);
  };

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(f => f !== fieldId)
        : [...prev, fieldId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'import' ? (
              <><Upload className="h-5 w-5" /> Import Contacts</>
            ) : (
              <><Download className="h-5 w-5" /> Export Contacts</>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'import' 
              ? 'Upload a CSV file to import contacts' 
              : 'Select fields to include in the export'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {mode === 'import' ? (
            <>
              {/* File Upload */}
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-foreground font-medium">Click to upload CSV file</p>
                <p className="text-sm text-muted-foreground mt-1">or drag and drop</p>
              </div>

              {/* Column Mapping */}
              {csvData.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Found {csvData.length - 1} rows</span>
                  </div>
                  
                  <Label>Map Columns</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {['name', 'phone', 'email', 'tags'].map((field) => (
                      <div key={field} className="space-y-1">
                        <Label className="text-xs capitalize">{field} {field === 'name' || field === 'phone' ? '*' : ''}</Label>
                        <Select
                          value={columnMapping[field] || ''}
                          onValueChange={(value) => setColumnMapping({ ...columnMapping, [field]: value })}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-- Skip --</SelectItem>
                            {csvData[0]?.map((header, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Export Field Selection */}
              <div className="space-y-3">
                <Label>Select Fields to Export</Label>
                <div className="space-y-2">
                  {exportFields.map((field) => (
                    <div key={field.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                      <Checkbox
                        id={field.id}
                        checked={selectedFields.includes(field.id)}
                        onCheckedChange={() => toggleField(field.id)}
                      />
                      <label htmlFor={field.id} className="flex-1 cursor-pointer">
                        {field.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p>{contacts.length} contacts will be exported</p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={mode === 'import' ? handleImport : handleExport}
            disabled={isLoading || (mode === 'import' && csvData.length === 0)}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {mode === 'import' ? 'Importing...' : 'Exporting...'}
              </>
            ) : (
              <>
                {mode === 'import' ? <Upload className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                {mode === 'import' ? 'Import' : 'Export'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportExportContacts;
