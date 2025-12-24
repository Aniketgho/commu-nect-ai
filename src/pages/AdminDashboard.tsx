import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import { 
  Users, 
  DollarSign, 
  MessageSquare, 
  Bot,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Server,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Tenants",
      value: "1,248",
      change: "↑ 23 new this month",
      changeType: "positive" as const,
      icon: Users,
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
    },
    {
      title: "Monthly Revenue",
      value: "$248,592",
      change: "↑ 18.3% from last month",
      changeType: "positive" as const,
      icon: DollarSign,
      iconColor: "text-emerald-500",
      iconBgColor: "bg-emerald-500/10",
    },
    {
      title: "Total Messages",
      value: "52.4M",
      change: "↑ 32% from last month",
      changeType: "positive" as const,
      icon: MessageSquare,
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-500/10",
    },
    {
      title: "AI Tokens Used",
      value: "128.5M",
      change: "$12,850 cost this month",
      changeType: "neutral" as const,
      icon: Bot,
      iconColor: "text-violet-500",
      iconBgColor: "bg-violet-500/10",
    },
  ];

  const topTenants = [
    { name: "Acme Corp", plan: "Enterprise", revenue: "$4,500", messages: "2.4M", status: "healthy" },
    { name: "TechStart Inc", plan: "Professional", revenue: "$1,290", messages: "890K", status: "healthy" },
    { name: "Global Retail", plan: "Enterprise", revenue: "$3,200", messages: "1.8M", status: "warning" },
    { name: "Local Bistro", plan: "Starter", revenue: "$49", messages: "12K", status: "healthy" },
  ];

  const systemHealth = [
    { name: "API Gateway", status: "operational", latency: "23ms" },
    { name: "Message Queue", status: "operational", latency: "12ms" },
    { name: "Database", status: "operational", latency: "5ms" },
    { name: "AI Services", status: "degraded", latency: "145ms" },
  ];

  return (
    <DashboardLayout panelType="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Master Admin Panel</h1>
            <p className="text-muted-foreground">Platform overview and management</p>
          </div>
          <div className="flex gap-3">
            <Button variant="glass">
              Export Report
            </Button>
            <Button variant="gradient">
              System Settings
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Tenants */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Top Tenants</h2>
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View All <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tenant</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Revenue</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Messages</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topTenants.map((tenant) => (
                    <tr key={tenant.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-medium text-foreground">{tenant.name}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          tenant.plan === 'Enterprise' 
                            ? 'bg-violet-500/10 text-violet-500' 
                            : tenant.plan === 'Professional'
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {tenant.plan}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-foreground font-medium">{tenant.revenue}</td>
                      <td className="py-4 px-4 text-foreground">{tenant.messages}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 ${
                          tenant.status === 'healthy' ? 'text-emerald-500' : 'text-yellow-500'
                        }`}>
                          {tenant.status === 'healthy' ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                          {tenant.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Health */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">System Health</h2>
              <Activity className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <div className="space-y-4">
              {systemHealth.map((service) => (
                <div 
                  key={service.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{service.latency}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      service.status === 'operational' ? 'bg-emerald-500' : 'bg-yellow-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Status</span>
                <span className="text-emerald-500 font-medium">99.8% Uptime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Revenue Overview</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">7D</Button>
              <Button variant="secondary" size="sm">30D</Button>
              <Button variant="ghost" size="sm">90D</Button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg border border-dashed border-border">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-primary/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Revenue chart visualization</p>
              <p className="text-sm text-muted-foreground/60">Connect to analytics to see data</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
