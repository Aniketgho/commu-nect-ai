import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointerClick, 
  MessageSquare, 
  Users, 
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for charts
const messageData = [
  { name: "Mon", sent: 420, delivered: 405, read: 320, clicked: 145 },
  { name: "Tue", sent: 380, delivered: 365, read: 290, clicked: 125 },
  { name: "Wed", sent: 510, delivered: 490, read: 410, clicked: 180 },
  { name: "Thu", sent: 450, delivered: 435, read: 350, clicked: 160 },
  { name: "Fri", sent: 620, delivered: 600, read: 480, clicked: 220 },
  { name: "Sat", sent: 280, delivered: 270, read: 200, clicked: 85 },
  { name: "Sun", sent: 190, delivered: 180, read: 140, clicked: 55 },
];

const engagementData = [
  { name: "Week 1", rate: 42 },
  { name: "Week 2", rate: 48 },
  { name: "Week 3", rate: 45 },
  { name: "Week 4", rate: 52 },
];

const campaignPerformance = [
  { name: "Welcome Series", sent: 1240, opened: 892, clicked: 345, conversion: 27.8 },
  { name: "Product Launch", sent: 3450, opened: 2156, clicked: 890, conversion: 25.8 },
  { name: "Re-engagement", sent: 890, opened: 534, clicked: 178, conversion: 20.0 },
  { name: "Flash Sale", sent: 2100, opened: 1680, clicked: 756, conversion: 36.0 },
  { name: "Newsletter", sent: 4200, opened: 2520, clicked: 840, conversion: 20.0 },
];

const deviceData = [
  { name: "Mobile", value: 68, color: "hsl(var(--primary))" },
  { name: "Desktop", value: 24, color: "hsl(var(--chart-2))" },
  { name: "Tablet", value: 8, color: "hsl(var(--chart-3))" },
];

const responseTimeData = [
  { name: "< 1 min", value: 35 },
  { name: "1-5 min", value: 42 },
  { name: "5-15 min", value: 15 },
  { name: "15-60 min", value: 5 },
  { name: "> 1 hr", value: 3 },
];

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  description 
}: { 
  title: string; 
  value: string; 
  change: string; 
  changeType: "up" | "down"; 
  icon: React.ElementType;
  description?: string;
}) => (
  <Card className="border-border/50">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center gap-1 mt-1">
        {changeType === "up" ? (
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500" />
        )}
        <span className={`text-xs font-medium ${changeType === "up" ? "text-green-500" : "text-red-500"}`}>
          {change}
        </span>
        <span className="text-xs text-muted-foreground">vs last period</span>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      )}
    </CardContent>
  </Card>
);

const Analytics = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>Analytics - WhatsFlow</title>
        <meta name="description" content="Track your messaging performance, clicks, and engagement metrics" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Track your messaging performance and engagement</p>
          </div>
          <Select defaultValue="7d">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Messages Sent"
            value="12,849"
            change="12.5%"
            changeType="up"
            icon={Send}
            description="Total messages sent this period"
          />
          <StatCard
            title="Delivery Rate"
            value="96.8%"
            change="1.2%"
            changeType="up"
            icon={CheckCircle2}
            description="Successfully delivered messages"
          />
          <StatCard
            title="Open Rate"
            value="78.4%"
            change="3.8%"
            changeType="up"
            icon={Eye}
            description="Messages read by recipients"
          />
          <StatCard
            title="Click Rate"
            value="32.6%"
            change="2.1%"
            changeType="down"
            icon={MousePointerClick}
            description="Links clicked in messages"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Message Performance Chart */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Message Performance
                  </CardTitle>
                  <CardDescription>Daily message metrics breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={messageData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="sent" 
                          stackId="1"
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))"
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="delivered" 
                          stackId="2"
                          stroke="hsl(var(--chart-2))" 
                          fill="hsl(var(--chart-2))"
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="read" 
                          stackId="3"
                          stroke="hsl(var(--chart-3))" 
                          fill="hsl(var(--chart-3))"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">Sent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-2))" }} />
                      <span className="text-sm text-muted-foreground">Delivered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-3))" }} />
                      <span className="text-sm text-muted-foreground">Read</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Click Analytics */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointerClick className="h-5 w-5 text-primary" />
                    Click Analytics
                  </CardTitle>
                  <CardDescription>Link click performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={messageData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Bar 
                          dataKey="clicked" 
                          fill="hsl(var(--primary))" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Clicks</p>
                      <p className="text-xl font-bold">970</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg CTR</p>
                      <p className="text-xl font-bold">32.6%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Device & Response Time */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Device Breakdown */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                  <CardDescription>Where your messages are being read</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-4">
                    {deviceData.map((device) => (
                      <div key={device.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                        <span className="text-sm text-muted-foreground">{device.name} ({device.value}%)</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Response Time
                  </CardTitle>
                  <CardDescription>How quickly users respond to messages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={responseTimeData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" className="text-xs" />
                        <YAxis dataKey="name" type="category" className="text-xs" width={70} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          fill="hsl(var(--primary))" 
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Average Response Time</p>
                    <p className="text-xl font-bold">3.2 minutes</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Detailed metrics for each campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Campaign</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Sent</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Opened</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Clicked</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Conversion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaignPerformance.map((campaign) => (
                        <tr key={campaign.name} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-4">
                            <span className="font-medium">{campaign.name}</span>
                          </td>
                          <td className="text-right py-3 px-4 text-muted-foreground">
                            {campaign.sent.toLocaleString()}
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className="text-muted-foreground">{campaign.opened.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({((campaign.opened / campaign.sent) * 100).toFixed(1)}%)
                            </span>
                          </td>
                          <td className="text-right py-3 px-4">
                            <span className="text-muted-foreground">{campaign.clicked.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({((campaign.clicked / campaign.sent) * 100).toFixed(1)}%)
                            </span>
                          </td>
                          <td className="text-right py-3 px-4">
                            <Badge 
                              variant={campaign.conversion >= 30 ? "default" : "secondary"}
                              className={campaign.conversion >= 30 ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : ""}
                            >
                              {campaign.conversion}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Engagement Rate Trend */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Engagement Rate Trend
                  </CardTitle>
                  <CardDescription>Weekly engagement rate over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="rate" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Stats */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Engagement Summary</CardTitle>
                  <CardDescription>Key engagement metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Conversations Started</p>
                          <p className="text-sm text-muted-foreground">From messages sent</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">2,847</p>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> +18.2%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Active Users</p>
                          <p className="text-sm text-muted-foreground">Engaged this period</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">8,432</p>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> +12.5%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Avg. Session Duration</p>
                          <p className="text-sm text-muted-foreground">Time spent in chat</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">4m 32s</p>
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" /> -3.2%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Resolution Rate</p>
                          <p className="text-sm text-muted-foreground">Issues resolved via chat</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">87.3%</p>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> +5.8%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
