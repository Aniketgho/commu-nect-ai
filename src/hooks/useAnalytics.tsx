import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

interface DailyAnalytics {
  id: string;
  date: string;
  messages_sent: number;
  messages_delivered: number;
  messages_read: number;
  messages_clicked: number;
  messages_failed: number;
  conversations_started: number;
  active_users: number;
  avg_response_time_seconds: number;
  device_mobile: number;
  device_desktop: number;
  device_tablet: number;
}

interface CampaignWithAnalytics {
  id: string;
  name: string;
  status: string;
  total_sent: number;
  total_delivered: number;
  total_read: number;
  total_clicked: number;
  conversion_rate: number;
}

interface AnalyticsSummary {
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalClicked: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  previousSent: number;
  previousDelivered: number;
  previousRead: number;
  previousClicked: number;
}

interface ChartDataPoint {
  name: string;
  sent: number;
  delivered: number;
  read: number;
  clicked: number;
}

interface DeviceData {
  name: string;
  value: number;
  color: string;
}

interface ResponseTimeData {
  name: string;
  value: number;
}

export function useAnalytics(period: string = "7d") {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dailyData, setDailyData] = useState<DailyAnalytics[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignWithAnalytics[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalSent: 0,
    totalDelivered: 0,
    totalRead: 0,
    totalClicked: 0,
    deliveryRate: 0,
    openRate: 0,
    clickRate: 0,
    previousSent: 0,
    previousDelivered: 0,
    previousRead: 0,
    previousClicked: 0,
  });

  const getPeriodDays = (period: string): number => {
    switch (period) {
      case "24h": return 1;
      case "7d": return 7;
      case "30d": return 30;
      case "90d": return 90;
      default: return 7;
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      const days = getPeriodDays(period);
      const startDate = format(subDays(new Date(), days), "yyyy-MM-dd");
      const previousStartDate = format(subDays(new Date(), days * 2), "yyyy-MM-dd");
      const previousEndDate = format(subDays(new Date(), days), "yyyy-MM-dd");

      try {
        // Fetch daily analytics for current period
        const { data: dailyAnalytics, error: dailyError } = await supabase
          .from("daily_analytics")
          .select("*")
          .eq("user_id", user.id)
          .gte("date", startDate)
          .order("date", { ascending: true });

        if (dailyError) throw dailyError;

        // Fetch daily analytics for previous period (for comparison)
        const { data: previousAnalytics, error: previousError } = await supabase
          .from("daily_analytics")
          .select("*")
          .eq("user_id", user.id)
          .gte("date", previousStartDate)
          .lt("date", previousEndDate)
          .order("date", { ascending: true });

        if (previousError) throw previousError;

        // Fetch campaigns with their analytics
        const { data: campaignsData, error: campaignsError } = await supabase
          .from("campaigns")
          .select("*")
          .eq("user_id", user.id);

        if (campaignsError) throw campaignsError;

        // Fetch campaign analytics
        const { data: campaignAnalyticsData, error: campaignAnalyticsError } = await supabase
          .from("campaign_analytics")
          .select("*")
          .eq("user_id", user.id)
          .gte("date", startDate);

        if (campaignAnalyticsError) throw campaignAnalyticsError;

        // Process daily data
        setDailyData(dailyAnalytics || []);

        // Calculate summary for current period
        const currentSummary = (dailyAnalytics || []).reduce(
          (acc, day) => ({
            totalSent: acc.totalSent + day.messages_sent,
            totalDelivered: acc.totalDelivered + day.messages_delivered,
            totalRead: acc.totalRead + day.messages_read,
            totalClicked: acc.totalClicked + day.messages_clicked,
          }),
          { totalSent: 0, totalDelivered: 0, totalRead: 0, totalClicked: 0 }
        );

        // Calculate summary for previous period
        const previousSummary = (previousAnalytics || []).reduce(
          (acc, day) => ({
            totalSent: acc.totalSent + day.messages_sent,
            totalDelivered: acc.totalDelivered + day.messages_delivered,
            totalRead: acc.totalRead + day.messages_read,
            totalClicked: acc.totalClicked + day.messages_clicked,
          }),
          { totalSent: 0, totalDelivered: 0, totalRead: 0, totalClicked: 0 }
        );

        setSummary({
          ...currentSummary,
          deliveryRate: currentSummary.totalSent > 0 
            ? (currentSummary.totalDelivered / currentSummary.totalSent) * 100 
            : 0,
          openRate: currentSummary.totalDelivered > 0 
            ? (currentSummary.totalRead / currentSummary.totalDelivered) * 100 
            : 0,
          clickRate: currentSummary.totalRead > 0 
            ? (currentSummary.totalClicked / currentSummary.totalRead) * 100 
            : 0,
          previousSent: previousSummary.totalSent,
          previousDelivered: previousSummary.totalDelivered,
          previousRead: previousSummary.totalRead,
          previousClicked: previousSummary.totalClicked,
        });

        // Aggregate campaign analytics
        const campaignStatsMap = new Map<string, {
          sent: number;
          delivered: number;
          read: number;
          clicked: number;
          conversions: number;
        }>();

        (campaignAnalyticsData || []).forEach((ca) => {
          const existing = campaignStatsMap.get(ca.campaign_id) || {
            sent: 0, delivered: 0, read: 0, clicked: 0, conversions: 0
          };
          campaignStatsMap.set(ca.campaign_id, {
            sent: existing.sent + ca.messages_sent,
            delivered: existing.delivered + ca.messages_delivered,
            read: existing.read + ca.messages_read,
            clicked: existing.clicked + ca.messages_clicked,
            conversions: existing.conversions + ca.conversions,
          });
        });

        const campaignsWithStats: CampaignWithAnalytics[] = (campaignsData || []).map((c) => {
          const stats = campaignStatsMap.get(c.id) || {
            sent: 0, delivered: 0, read: 0, clicked: 0, conversions: 0
          };
          return {
            id: c.id,
            name: c.name,
            status: c.status,
            total_sent: stats.sent,
            total_delivered: stats.delivered,
            total_read: stats.read,
            total_clicked: stats.clicked,
            conversion_rate: stats.sent > 0 
              ? (stats.conversions / stats.sent) * 100 
              : 0,
          };
        });

        setCampaigns(campaignsWithStats);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, period]);

  // Transform daily data for charts
  const getChartData = (): ChartDataPoint[] => {
    const days = getPeriodDays(period);
    const chartData: ChartDataPoint[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, "yyyy-MM-dd");
      const dayData = dailyData.find((d) => d.date === dateStr);
      
      chartData.push({
        name: format(date, days <= 7 ? "EEE" : "MMM dd"),
        sent: dayData?.messages_sent || 0,
        delivered: dayData?.messages_delivered || 0,
        read: dayData?.messages_read || 0,
        clicked: dayData?.messages_clicked || 0,
      });
    }
    
    return chartData;
  };

  // Calculate device distribution
  const getDeviceData = (): DeviceData[] => {
    const totals = dailyData.reduce(
      (acc, day) => ({
        mobile: acc.mobile + day.device_mobile,
        desktop: acc.desktop + day.device_desktop,
        tablet: acc.tablet + day.device_tablet,
      }),
      { mobile: 0, desktop: 0, tablet: 0 }
    );

    const total = totals.mobile + totals.desktop + totals.tablet;
    if (total === 0) {
      return [
        { name: "Mobile", value: 0, color: "hsl(var(--primary))" },
        { name: "Desktop", value: 0, color: "hsl(var(--chart-2))" },
        { name: "Tablet", value: 0, color: "hsl(var(--chart-3))" },
      ];
    }

    return [
      { name: "Mobile", value: Math.round((totals.mobile / total) * 100), color: "hsl(var(--primary))" },
      { name: "Desktop", value: Math.round((totals.desktop / total) * 100), color: "hsl(var(--chart-2))" },
      { name: "Tablet", value: Math.round((totals.tablet / total) * 100), color: "hsl(var(--chart-3))" },
    ];
  };

  // Calculate average response time distribution
  const getAvgResponseTime = (): number => {
    if (dailyData.length === 0) return 0;
    const totalSeconds = dailyData.reduce((acc, day) => acc + day.avg_response_time_seconds, 0);
    return Math.round(totalSeconds / dailyData.length);
  };

  // Calculate percentage change
  const getPercentChange = (current: number, previous: number): { value: string; type: "up" | "down" } => {
    if (previous === 0) {
      return { value: current > 0 ? "100%" : "0%", type: "up" };
    }
    const change = ((current - previous) / previous) * 100;
    return {
      value: `${Math.abs(change).toFixed(1)}%`,
      type: change >= 0 ? "up" : "down",
    };
  };

  // Get engagement stats
  const getEngagementStats = () => {
    const totalConversations = dailyData.reduce((acc, day) => acc + day.conversations_started, 0);
    const totalActiveUsers = dailyData.reduce((acc, day) => acc + day.active_users, 0);
    const avgSessionDuration = getAvgResponseTime();

    return {
      conversationsStarted: totalConversations,
      activeUsers: totalActiveUsers,
      avgSessionDuration,
    };
  };

  return {
    loading,
    summary,
    campaigns,
    chartData: getChartData(),
    deviceData: getDeviceData(),
    avgResponseTime: getAvgResponseTime(),
    engagementStats: getEngagementStats(),
    getPercentChange,
    hasData: dailyData.length > 0 || campaigns.length > 0,
  };
}
