import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { 
  MessageSquare, 
  Users, 
  Bot, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Messages",
      value: "124,583",
      change: "↑ 12.5% from last month",
      changeType: "positive" as const,
      icon: MessageSquare,
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
    },
    {
      title: "Active Contacts",
      value: "8,249",
      change: "↑ 8.2% from last month",
      changeType: "positive" as const,
      icon: Users,
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-500/10",
    },
    {
      title: "AI Responses",
      value: "92,481",
      change: "74% automation rate",
      changeType: "positive" as const,
      icon: Bot,
      iconColor: "text-emerald-500",
      iconBgColor: "bg-emerald-500/10",
    },
    {
      title: "Conversion Rate",
      value: "32.4%",
      change: "↑ 4.2% this week",
      changeType: "positive" as const,
      icon: TrendingUp,
      iconColor: "text-violet-500",
      iconBgColor: "bg-violet-500/10",
    },
  ];

  const recentChats = [
    { name: "Sarah Johnson", message: "I'd like to know about pricing...", time: "2m ago", unread: true },
    { name: "Mike Chen", message: "Order #12345 status?", time: "5m ago", unread: true },
    { name: "Emily Brown", message: "Thanks for the quick response!", time: "12m ago", unread: false },
    { name: "David Wilson", message: "Can I schedule a demo?", time: "23m ago", unread: false },
  ];

  const campaigns = [
    { name: "Black Friday Sale", status: "active", sent: 12500, delivered: 12340, read: 8920 },
    { name: "New Product Launch", status: "scheduled", sent: 0, delivered: 0, read: 0 },
    { name: "Customer Feedback", status: "completed", sent: 5000, delivered: 4890, read: 3210 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, John! Here's what's happening.</p>
          </div>
          <Button variant="gradient" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            New Campaign
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Chats */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Recent Conversations</h2>
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View All <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentChats.map((chat) => (
                <div 
                  key={chat.name}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
                    {chat.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">{chat.name}</p>
                      {chat.unread && (
                        <span className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{chat.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Send Broadcast</p>
                  <p className="text-xs text-muted-foreground">Reach your audience</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Bot className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Create AI Agent</p>
                  <p className="text-xs text-muted-foreground">Automate responses</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Import Contacts</p>
                  <p className="text-xs text-muted-foreground">Grow your list</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Recent Campaigns</h2>
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              View All <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Campaign</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sent</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Delivered</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Read</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-medium text-foreground">{campaign.name}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : campaign.status === 'scheduled'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {campaign.status === 'active' && <CheckCircle2 className="h-3 w-3" />}
                        {campaign.status === 'scheduled' && <Clock className="h-3 w-3" />}
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-foreground">{campaign.sent.toLocaleString()}</td>
                    <td className="py-4 px-4 text-foreground">{campaign.delivered.toLocaleString()}</td>
                    <td className="py-4 px-4 text-foreground">{campaign.read.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
