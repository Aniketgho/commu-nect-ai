import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/hooks/useAnalytics";
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
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle
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

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  description,
  loading = false
}: { 
  title: string; 
  value: string; 
  change: string; 
  changeType: "up" | "down"; 
  icon: React.ElementType;
  description?: string;
  loading?: boolean;
}) => (
  <Card className="border-border/50">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {loading ? (
        <>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-32" />
        </>
      ) : (
        <>
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
        </>
      )}
    </CardContent>
  </Card>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
    <h3 className="text-lg font-medium text-foreground mb-2">No Data Available</h3>
    <p className="text-muted-foreground max-w-md">{message}</p>
  </div>
);

const Analytics = () => {
  const [period, setPeriod] = useState("7d");
  const { 
    loading, 
    summary, 
    campaigns, 
    chartData, 
    deviceData, 
    avgResponseTime,
    engagementStats,
    getPercentChange,
    hasData
  } = useAnalytics(period);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  };

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
          <Select value={period} onValueChange={setPeriod}>
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
            value={loading ? "..." : summary.totalSent.toLocaleString()}
            change={getPercentChange(summary.totalSent, summary.previousSent).value}
            changeType={getPercentChange(summary.totalSent, summary.previousSent).type}
            icon={Send}
            description="Total messages sent this period"
            loading={loading}
          />
          <StatCard
            title="Delivery Rate"
            value={loading ? "..." : `${summary.deliveryRate.toFixed(1)}%`}
            change={getPercentChange(summary.totalDelivered, summary.previousDelivered).value}
            changeType={getPercentChange(summary.totalDelivered, summary.previousDelivered).type}
            icon={CheckCircle2}
            description="Successfully delivered messages"
            loading={loading}
          />
          <StatCard
            title="Open Rate"
            value={loading ? "..." : `${summary.openRate.toFixed(1)}%`}
            change={getPercentChange(summary.totalRead, summary.previousRead).value}
            changeType={getPercentChange(summary.totalRead, summary.previousRead).type}
            icon={Eye}
            description="Messages read by recipients"
            loading={loading}
          />
          <StatCard
            title="Click Rate"
            value={loading ? "..." : `${summary.clickRate.toFixed(1)}%`}
            change={getPercentChange(summary.totalClicked, summary.previousClicked).value}
            changeType={getPercentChange(summary.totalClicked, summary.previousClicked).type}
            icon={MousePointerClick}
            description="Links clicked in messages"
            loading={loading}
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
            {loading ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border/50">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
              </div>
            ) : !hasData ? (
              <Card className="border-border/50">
                <CardContent>
                  <EmptyState message="Start sending messages to see your analytics data here. Your message performance, delivery rates, and engagement metrics will appear once you begin campaigns." />
                </CardContent>
              </Card>
            ) : (
              <>
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
                          <AreaChart data={chartData}>
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
                          <BarChart data={chartData}>
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
                          <p className="text-xl font-bold">{summary.totalClicked.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg CTR</p>
                          <p className="text-xl font-bold">{summary.clickRate.toFixed(1)}%</p>
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
                      {deviceData.every(d => d.value === 0) ? (
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                          No device data available yet
                        </div>
                      ) : (
                        <>
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
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Response Time */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Response Time
                      </CardTitle>
                      <CardDescription>Average time users take to respond</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center h-[200px]">
                        <div className="text-5xl font-bold text-primary">
                          {avgResponseTime > 0 ? formatTime(avgResponseTime) : "--"}
                        </div>
                        <p className="text-muted-foreground mt-2">Average Response Time</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Conversations</p>
                          <p className="text-xl font-bold">{engagementStats.conversationsStarted.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Active Users</p>
                          <p className="text-xl font-bold">{engagementStats.activeUsers.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Detailed metrics for each campaign</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : campaigns.length === 0 ? (
                  <EmptyState message="You haven't created any campaigns yet. Create your first campaign to start tracking performance metrics." />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Campaign</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Sent</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Delivered</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Clicked</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Conversion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map((campaign) => (
                          <tr key={campaign.id} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{campaign.name}</span>
                                <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                  {campaign.status}
                                </Badge>
                              </div>
                            </td>
                            <td className="text-right py-3 px-4 text-muted-foreground">
                              {campaign.total_sent.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-4">
                              <span className="text-muted-foreground">{campaign.total_delivered.toLocaleString()}</span>
                              {campaign.total_sent > 0 && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({((campaign.total_delivered / campaign.total_sent) * 100).toFixed(1)}%)
                                </span>
                              )}
                            </td>
                            <td className="text-right py-3 px-4">
                              <span className="text-muted-foreground">{campaign.total_clicked.toLocaleString()}</span>
                              {campaign.total_sent > 0 && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({((campaign.total_clicked / campaign.total_sent) * 100).toFixed(1)}%)
                                </span>
                              )}
                            </td>
                            <td className="text-right py-3 px-4">
                              <Badge 
                                variant={campaign.conversion_rate >= 30 ? "default" : "secondary"}
                                className={campaign.conversion_rate >= 30 ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : ""}
                              >
                                {campaign.conversion_rate.toFixed(1)}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="space-y-6">
            {loading ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border/50">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </CardContent>
                </Card>
              </div>
            ) : !hasData ? (
              <Card className="border-border/50">
                <CardContent>
                  <EmptyState message="Engagement data will appear here once your messages start receiving responses and interactions from users." />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Engagement Rate Trend */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Message Delivery Trend
                    </CardTitle>
                    <CardDescription>Daily delivery performance over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
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
                            dataKey="delivered" 
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
                          <p className="text-xl font-bold">{engagementStats.conversationsStarted.toLocaleString()}</p>
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
                          <p className="text-xl font-bold">{engagementStats.activeUsers.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Avg. Response Time</p>
                            <p className="text-sm text-muted-foreground">Time to first reply</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            {avgResponseTime > 0 ? formatTime(avgResponseTime) : "--"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Delivery Rate</p>
                            <p className="text-sm text-muted-foreground">Successfully delivered</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{summary.deliveryRate.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
