import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  MessageSquare, 
  Link2, 
  Unlink, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  ExternalLink,
  Loader2
} from "lucide-react";
import { WhatsAppConfig } from "@/types/contacts";

interface WhatsAppIntegrationProps {
  config?: WhatsAppConfig;
  onSave: (config: WhatsAppConfig) => void;
  onDisconnect: () => void;
}

const WhatsAppIntegration = ({ config, onSave, onDisconnect }: WhatsAppIntegrationProps) => {
  const [isEditing, setIsEditing] = useState(!config?.isConnected);
  const [showToken, setShowToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumberId: config?.phoneNumberId || '',
    businessAccountId: config?.businessAccountId || '',
    accessToken: config?.accessToken || '',
    webhookVerifyToken: config?.webhookVerifyToken || '',
  });

  const handleSave = async () => {
    if (!formData.phoneNumberId || !formData.businessAccountId || !formData.accessToken) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSave({
      ...formData,
      isConnected: true,
      connectedAt: new Date(),
    });
    
    setIsSaving(false);
    setIsEditing(false);
    toast.success('WhatsApp API connected successfully!');
  };

  const handleDisconnect = () => {
    onDisconnect();
    setFormData({
      phoneNumberId: '',
      businessAccountId: '',
      accessToken: '',
      webhookVerifyToken: '',
    });
    setIsEditing(true);
    toast.success('WhatsApp API disconnected');
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/api/webhook/whatsapp`);
    toast.success('Webhook URL copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Connection Status Card */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">Meta WhatsApp Business API</CardTitle>
                <CardDescription>Connect your WhatsApp Business account to send messages</CardDescription>
              </div>
            </div>
            <Badge variant={config?.isConnected ? "default" : "secondary"} className="gap-1">
              {config?.isConnected ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Connected
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" />
                  Not Connected
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Credentials Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumberId">Phone Number ID *</Label>
                <Input
                  id="phoneNumberId"
                  placeholder="Enter your Phone Number ID"
                  value={formData.phoneNumberId}
                  onChange={(e) => setFormData({ ...formData, phoneNumberId: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessAccountId">Business Account ID *</Label>
                <Input
                  id="businessAccountId"
                  placeholder="Enter your Business Account ID"
                  value={formData.businessAccountId}
                  onChange={(e) => setFormData({ ...formData, businessAccountId: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessToken">Access Token *</Label>
              <div className="relative">
                <Input
                  id="accessToken"
                  type={showToken ? "text" : "password"}
                  placeholder="Enter your Access Token"
                  value={formData.accessToken}
                  onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                  disabled={!isEditing}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhookVerifyToken">Webhook Verify Token (Optional)</Label>
              <Input
                id="webhookVerifyToken"
                placeholder="Enter a custom verify token"
                value={formData.webhookVerifyToken}
                onChange={(e) => setFormData({ ...formData, webhookVerifyToken: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Webhook URL */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <Label className="text-sm text-muted-foreground">Webhook URL (Add this to Meta Developer Console)</Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-background rounded text-sm text-foreground overflow-x-auto">
                {window.location.origin}/api/webhook/whatsapp
              </code>
              <Button variant="outline" size="icon" onClick={copyWebhookUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <a
              href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View Setup Guide <ExternalLink className="h-3 w-3" />
            </a>
            <div className="flex items-center gap-2">
              {config?.isConnected && !isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Configuration
                  </Button>
                  <Button variant="destructive" onClick={handleDisconnect} className="gap-2">
                    <Unlink className="h-4 w-4" />
                    Disconnect
                  </Button>
                </>
              ) : (
                <>
                  {config?.isConnected && (
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  )}
                  <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4" />
                        Connect API
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Info */}
      {config?.isConnected && config.connectedAt && (
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Connected on {config.connectedAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>Phone ID: {config.phoneNumberId}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WhatsAppIntegration;
