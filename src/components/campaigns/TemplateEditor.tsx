import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MessageTemplate,
  TemplateButton,
  TemplateCategory,
} from "@/types/campaigns";
import {
  FileText,
  Image,
  Video,
  File,
  Plus,
  X,
  Phone,
  ExternalLink,
  MessageSquare,
  Smartphone,
  AlertCircle,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface TemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: MessageTemplate | null;
  onSave: (template: Partial<MessageTemplate>) => void;
}

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "pt", label: "Portuguese" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "hi", label: "Hindi" },
  { value: "ar", label: "Arabic" },
];

const categories: { value: TemplateCategory; label: string; description: string }[] = [
  {
    value: "marketing",
    label: "Marketing",
    description: "Promotional messages, offers, and updates",
  },
  {
    value: "utility",
    label: "Utility",
    description: "Order updates, account notifications, alerts",
  },
  {
    value: "authentication",
    label: "Authentication",
    description: "OTP, verification codes, login alerts",
  },
];

const headerTypes = [
  { value: "none", label: "None", icon: null },
  { value: "text", label: "Text", icon: FileText },
  { value: "image", label: "Image", icon: Image },
  { value: "video", label: "Video", icon: Video },
  { value: "document", label: "Document", icon: File },
];

const buttonTypes = [
  { value: "quick_reply", label: "Quick Reply", icon: MessageSquare },
  { value: "url", label: "Visit Website", icon: ExternalLink },
  { value: "phone", label: "Call Phone", icon: Phone },
];

const TemplateEditor = ({
  open,
  onOpenChange,
  template,
  onSave,
}: TemplateEditorProps) => {
  const [activeTab, setActiveTab] = useState("content");
  const [formData, setFormData] = useState({
    name: "",
    category: "utility" as TemplateCategory,
    language: "en",
    headerType: "none" as "text" | "image" | "video" | "document" | "none",
    headerContent: "",
    bodyText: "",
    footerText: "",
    buttons: [] as TemplateButton[],
    variables: [] as string[],
  });

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        category: template.category,
        language: template.language,
        headerType: template.headerType,
        headerContent: template.headerContent || "",
        bodyText: template.bodyText,
        footerText: template.footerText || "",
        buttons: template.buttons || [],
        variables: template.variables,
      });
    } else {
      setFormData({
        name: "",
        category: "utility",
        language: "en",
        headerType: "none",
        headerContent: "",
        bodyText: "",
        footerText: "",
        buttons: [],
        variables: [],
      });
    }
  }, [template, open]);

  const extractVariables = (text: string): string[] => {
    const regex = /\{\{(\d+)\}\}/g;
    const matches = text.match(regex);
    if (!matches) return [];
    return [...new Set(matches)].map((m) => m.replace(/[{}]/g, ""));
  };

  const handleBodyChange = (value: string) => {
    const variables = extractVariables(value);
    const headerVars = extractVariables(formData.headerContent);
    setFormData({
      ...formData,
      bodyText: value,
      variables: [...new Set([...headerVars, ...variables])],
    });
  };

  const handleHeaderContentChange = (value: string) => {
    const headerVars = extractVariables(value);
    const bodyVars = extractVariables(formData.bodyText);
    setFormData({
      ...formData,
      headerContent: value,
      variables: [...new Set([...headerVars, ...bodyVars])],
    });
  };

  const addButton = () => {
    if (formData.buttons.length >= 3) {
      toast.error("Maximum 3 buttons allowed per template");
      return;
    }
    setFormData({
      ...formData,
      buttons: [...formData.buttons, { type: "quick_reply", text: "" }],
    });
  };

  const updateButton = (index: number, updates: Partial<TemplateButton>) => {
    const updatedButtons = [...formData.buttons];
    updatedButtons[index] = { ...updatedButtons[index], ...updates };
    setFormData({ ...formData, buttons: updatedButtons });
  };

  const removeButton = (index: number) => {
    setFormData({
      ...formData,
      buttons: formData.buttons.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Template name is required");
      return;
    }
    if (!formData.bodyText.trim()) {
      toast.error("Message body is required");
      return;
    }
    if (formData.bodyText.length > 1024) {
      toast.error("Message body exceeds 1024 characters");
      return;
    }

    onSave({
      id: template?.id || Date.now().toString(),
      name: formData.name,
      category: formData.category,
      status: "pending",
      language: formData.language,
      headerType: formData.headerType,
      headerContent: formData.headerContent || undefined,
      bodyText: formData.bodyText,
      footerText: formData.footerText || undefined,
      buttons: formData.buttons.length > 0 ? formData.buttons : undefined,
      variables: formData.variables,
      createdAt: template?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    onOpenChange(false);
  };

  const renderPreview = () => {
    return (
      <div className="bg-[#e5ddd5] dark:bg-zinc-900 rounded-lg p-4 h-full min-h-[400px]">
        <div className="max-w-[280px] mx-auto">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm overflow-hidden">
            {formData.headerType !== "none" && (
              <div className="border-b border-border">
                {formData.headerType === "image" && (
                  <div className="h-32 bg-muted flex items-center justify-center">
                    <Image className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                {formData.headerType === "video" && (
                  <div className="h-32 bg-muted flex items-center justify-center">
                    <Video className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                {formData.headerType === "document" && (
                  <div className="h-16 bg-muted flex items-center justify-center gap-2">
                    <File className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Document</span>
                  </div>
                )}
                {formData.headerType === "text" && formData.headerContent && (
                  <div className="px-3 py-2">
                    <p className="font-semibold text-foreground text-sm">
                      {formData.headerContent}
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="p-3">
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {formData.bodyText || "Your message will appear here..."}
              </p>
              {formData.footerText && (
                <p className="text-xs text-muted-foreground mt-2">
                  {formData.footerText}
                </p>
              )}
            </div>
            {formData.buttons.length > 0 && (
              <div className="border-t border-border">
                {formData.buttons.map((button, index) => (
                  <button
                    key={index}
                    className="w-full py-2 text-center text-sm text-primary hover:bg-muted/50 border-b border-border last:border-b-0 flex items-center justify-center gap-2"
                  >
                    {button.type === "url" && <ExternalLink className="h-3 w-3" />}
                    {button.type === "phone" && <Phone className="h-3 w-3" />}
                    {button.text || "Button"}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {template ? "Edit Template" : "Create New Template"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor Section */}
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="buttons">Buttons</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Template Name</Label>
                    <Input
                      placeholder="e.g., order_confirmation"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, "_") })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Use lowercase letters, numbers, and underscores only
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Header Type</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {headerTypes.map((type) => (
                        <button
                          key={type.value}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            formData.headerType === type.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              headerType: type.value as typeof formData.headerType,
                            })
                          }
                        >
                          {type.icon && <type.icon className="h-4 w-4 mx-auto mb-1" />}
                          <span className="text-xs">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.headerType === "text" && (
                    <div className="space-y-2">
                      <Label>Header Text</Label>
                      <Input
                        placeholder="Enter header text with {{1}} for variables"
                        value={formData.headerContent}
                        onChange={(e) => handleHeaderContentChange(e.target.value)}
                        maxLength={60}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.headerContent.length}/60 characters
                      </p>
                    </div>
                  )}

                  {(formData.headerType === "image" ||
                    formData.headerType === "video" ||
                    formData.headerType === "document") && (
                    <div className="space-y-2">
                      <Label>Media URL (Optional)</Label>
                      <Input
                        placeholder="https://example.com/media.jpg"
                        value={formData.headerContent}
                        onChange={(e) =>
                          setFormData({ ...formData, headerContent: e.target.value })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Sample URL for template preview. Actual media will be sent during campaign.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Message Body</Label>
                    <Textarea
                      placeholder="Enter your message. Use {{1}}, {{2}}, etc. for variables"
                      value={formData.bodyText}
                      onChange={(e) => handleBodyChange(e.target.value)}
                      className="min-h-[120px]"
                      maxLength={1024}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Use {"{{1}}"}, {"{{2}}"}, etc. for personalization
                      </span>
                      <span>{formData.bodyText.length}/1024</span>
                    </div>
                  </div>

                  {formData.variables.length > 0 && (
                    <div className="space-y-2">
                      <Label>Variables Detected</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.variables.map((variable, index) => (
                          <Badge key={index} variant="secondary">
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Footer (Optional)</Label>
                    <Input
                      placeholder="e.g., Reply STOP to unsubscribe"
                      value={formData.footerText}
                      onChange={(e) =>
                        setFormData({ ...formData, footerText: e.target.value })
                      }
                      maxLength={60}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.footerText.length}/60 characters
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="buttons" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Call-to-Action Buttons</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add up to 3 buttons to your template
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addButton}
                      disabled={formData.buttons.length >= 3}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Button
                    </Button>
                  </div>

                  {formData.buttons.length === 0 ? (
                    <Card className="border-dashed">
                      <CardContent className="py-8 text-center">
                        <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No buttons added yet
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={addButton}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Button
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {formData.buttons.map((button, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <Label>Button {index + 1}</Label>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => removeButton(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {buttonTypes.map((type) => (
                                <button
                                  key={type.value}
                                  className={`p-2 rounded-lg border text-center transition-all flex items-center justify-center gap-2 ${
                                    button.type === type.value
                                      ? "border-primary bg-primary/10"
                                      : "border-border hover:border-primary/50"
                                  }`}
                                  onClick={() =>
                                    updateButton(index, {
                                      type: type.value as TemplateButton["type"],
                                    })
                                  }
                                >
                                  <type.icon className="h-4 w-4" />
                                  <span className="text-xs">{type.label}</span>
                                </button>
                              ))}
                            </div>
                            <div className="space-y-2">
                              <Input
                                placeholder="Button text"
                                value={button.text}
                                onChange={(e) =>
                                  updateButton(index, { text: e.target.value })
                                }
                                maxLength={25}
                              />
                              {button.type === "url" && (
                                <Input
                                  placeholder="https://example.com"
                                  value={button.value || ""}
                                  onChange={(e) =>
                                    updateButton(index, { value: e.target.value })
                                  }
                                />
                              )}
                              {button.type === "phone" && (
                                <Input
                                  placeholder="+1234567890"
                                  value={button.value || ""}
                                  onChange={(e) =>
                                    updateButton(index, { value: e.target.value })
                                  }
                                />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium mb-1">Meta Button Guidelines:</p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Maximum 3 buttons per template</li>
                          <li>Quick replies: Max 2 buttons</li>
                          <li>URL/Phone: Max 1 of each type</li>
                          <li>Button text max 25 characters</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            formData.category === cat.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() =>
                            setFormData({ ...formData, category: cat.value })
                          }
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">
                              {cat.label}
                            </span>
                            {formData.category === cat.value && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {cat.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) =>
                        setFormData({ ...formData, language: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium mb-1">Template Approval:</p>
                        <p>
                          Templates are submitted to Meta for approval. Marketing
                          templates may take 24-48 hours. Utility templates are
                          usually approved faster.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Preview Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <Label>Preview</Label>
              </div>
              {renderPreview()}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {template ? "Update Template" : "Submit for Approval"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateEditor;
