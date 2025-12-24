import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Welcome back! Here's what's happening.</p>
          </div>
          <Button variant="gradient" className="gap-2 w-full sm:w-auto">
            <MessageSquare className="h-4 w-4" />
            New Campaign
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Chats */}
          <div className="lg:col-span-2 glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Recent Conversations</h2>
              <Button variant="ghost" size="sm" className="gap-1 text-primary text-xs sm:text-sm">
                View All <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
            <div className="space-y-2 sm:space-y-4">
              {recentChats.map((chat) => (
                <button 
                  key={chat.name}
                  onClick={() => navigate('/dashboard/inbox')}
                  className="w-full flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer text-left"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-xs sm:text-sm flex-shrink-0">
                    {chat.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground text-sm sm:text-base truncate">{chat.name}</p>
                      {chat.unread && (
                        <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{chat.message}</p>
                  </div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground flex-shrink-0">{chat.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">Quick Actions</h2>
            <div className="space-y-2 sm:space-y-3">
              <button 
                onClick={() => navigate('/dashboard/campaigns')}
                className="w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
              >
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm sm:text-base">Send Broadcast</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Reach your audience</p>
                </div>
              </button>
              <button 
                onClick={() => navigate('/dashboard/ai-agents')}
                className="w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
              >
                <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg flex-shrink-0">
                  <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm sm:text-base">Create AI Agent</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Automate responses</p>
                </div>
              </button>
              <button 
                onClick={() => navigate('/dashboard/contacts')}
                className="w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left"
              >
                <div className="p-1.5 sm:p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm sm:text-base">Import Contacts</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Grow your list</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Campaigns - Mobile Cards / Desktop Table */}
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Recent Campaigns</h2>
            <Button variant="ghost" size="sm" className="gap-1 text-primary text-xs sm:text-sm">
              View All <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          
          {/* Mobile Cards View */}
          <div className="block sm:hidden space-y-3">
            {campaigns.map((campaign) => (
              <div key={campaign.name} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground text-sm">{campaign.name}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    campaign.status === 'active' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : campaign.status === 'scheduled'
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {campaign.status === 'active' && <CheckCircle2 className="h-2.5 w-2.5" />}
                    {campaign.status === 'scheduled' && <Clock className="h-2.5 w-2.5" />}
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-background/50 rounded p-2">
                    <p className="text-[10px] text-muted-foreground">Sent</p>
                    <p className="text-sm font-semibold text-foreground">{campaign.sent.toLocaleString()}</p>
                  </div>
                  <div className="bg-background/50 rounded p-2">
                    <p className="text-[10px] text-muted-foreground">Delivered</p>
                    <p className="text-sm font-semibold text-foreground">{campaign.delivered.toLocaleString()}</p>
                  </div>
                  <div className="bg-background/50 rounded p-2">
                    <p className="text-[10px] text-muted-foreground">Read</p>
                    <p className="text-sm font-semibold text-foreground">{campaign.read.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
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
