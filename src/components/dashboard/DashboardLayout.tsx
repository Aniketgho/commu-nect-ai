import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  LayoutDashboard,
  Inbox,
  Megaphone,
  Workflow,
  Bot,
  Users,
  UserCircle,
  Tags,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
  Phone,
  Plus,
  CheckCircle2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardLayoutProps {
  children: React.ReactNode;
  panelType?: "user" | "admin";
}

const DashboardLayout = ({ children, panelType = "user" }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState("phone1");
  const location = useLocation();

  const phoneNumbers = [
    { id: "phone1", number: "+1 (555) 123-4567", label: "Business", status: "active" },
    { id: "phone2", number: "+1 (555) 987-6543", label: "Support", status: "active" },
    { id: "phone3", number: "+44 20 7946 0958", label: "UK Office", status: "inactive" },
  ];

  const userNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Inbox, label: "Inbox", href: "/dashboard/inbox" },
    { icon: Megaphone, label: "Campaigns", href: "/dashboard/campaigns" },
    { icon: Workflow, label: "Automation", href: "/dashboard/automation" },
    { icon: Bot, label: "AI Agents", href: "/dashboard/ai-agents" },
    { icon: Users, label: "CRM", href: "/dashboard/crm" },
    { icon: UserCircle, label: "Contacts", href: "/dashboard/contacts" },
    { icon: Tags, label: "Tags", href: "/dashboard/tags" },
    { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  const adminNavItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },
    { icon: Users, label: "Tenants", href: "/admin/tenants" },
    { icon: CreditCard, label: "Revenue", href: "/admin/revenue" },
    { icon: Bot, label: "AI Control", href: "/admin/ai" },
    { icon: Settings, label: "System", href: "/admin/system" },
  ];

  const navItems = panelType === "admin" ? adminNavItems : userNavItems;
  const currentPhone = phoneNumbers.find(p => p.id === selectedPhone);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-primary p-1.5 rounded-lg">
                <MessageSquare className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-sidebar-foreground">
                Whats<span className="text-primary">Flow</span>
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Phone Number Section */}
        {panelType === "user" && (
          <div className="px-3 py-3 border-b border-sidebar-border">
            {collapsed ? (
              <button className="w-full p-2 rounded-lg bg-sidebar-accent hover:bg-sidebar-primary/20 transition-colors flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Phone Numbers
                  </span>
                  <button className="p-1 rounded hover:bg-sidebar-accent transition-colors">
                    <Plus className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                  </button>
                </div>
                <Select value={selectedPhone} onValueChange={setSelectedPhone}>
                  <SelectTrigger className="w-full bg-sidebar-accent border-sidebar-border text-sidebar-foreground">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${currentPhone?.status === 'active' ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                        <span className="text-sm truncate">{currentPhone?.number}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {phoneNumbers.map((phone) => (
                      <SelectItem key={phone.id} value={phone.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${phone.status === 'active' ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                          <div className="flex flex-col">
                            <span className="text-sm">{phone.number}</span>
                            <span className="text-xs text-muted-foreground">{phone.label}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentPhone?.status === 'active' && (
                  <div className="flex items-center gap-1.5 px-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">Connected</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "" : "group-hover:text-primary"}`} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Link
            to="/help"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <HelpCircle className="h-5 w-5" />
            {!collapsed && <span className="text-sm">Help & Support</span>}
          </Link>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors w-full">
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Sun className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
