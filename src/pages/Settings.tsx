import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WhatsAppIntegration from "@/components/settings/WhatsAppIntegration";
import { WhatsAppConfig } from "@/types/contacts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, MessageSquare, Bell, Shield, Users } from "lucide-react";

const Settings = () => {
  const [whatsAppConfig, setWhatsAppConfig] = useState<WhatsAppConfig | undefined>();

  const handleSaveWhatsAppConfig = (config: WhatsAppConfig) => {
    setWhatsAppConfig(config);
  };

  const handleDisconnectWhatsApp = () => {
    setWhatsAppConfig(undefined);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your integrations and preferences</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="integrations" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="integrations" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="space-y-6">
            {/* WhatsApp Integration */}
            <WhatsAppIntegration
              config={whatsAppConfig}
              onSave={handleSaveWhatsAppConfig}
              onDisconnect={handleDisconnectWhatsApp}
            />

            {/* Other Integrations Placeholder */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Other Integrations</CardTitle>
                <CardDescription>Connect more services to enhance your workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Shopify', description: 'Sync orders & customers', status: 'coming' },
                    { name: 'Stripe', description: 'Accept payments', status: 'coming' },
                    { name: 'Zapier', description: 'Connect 5000+ apps', status: 'coming' },
                  ].map((integration) => (
                    <div 
                      key={integration.name}
                      className="p-4 bg-muted/50 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-foreground">{integration.name}</h3>
                        <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Notification Preferences</CardTitle>
                <CardDescription>Control how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Notification settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Security settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Team Management</CardTitle>
                <CardDescription>Manage team members and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Team management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
