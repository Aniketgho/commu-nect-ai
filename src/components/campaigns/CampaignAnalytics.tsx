import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Campaign } from "@/types/campaigns";
import { Send, CheckCircle, Eye, MessageSquare, MousePointer, XCircle, TrendingUp, Clock } from "lucide-react";

interface CampaignAnalyticsProps {
  campaign: Campaign;
}

const CampaignAnalytics = ({ campaign }: CampaignAnalyticsProps) => {
  const { analytics } = campaign;
  const total = analytics.sent || 1;

  const stats = [
    {
      label: 'Sent',
      value: analytics.sent,
      icon: Send,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Delivered',
      value: analytics.delivered,
      percentage: ((analytics.delivered / total) * 100).toFixed(1),
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Read',
      value: analytics.read,
      percentage: ((analytics.read / total) * 100).toFixed(1),
      icon: Eye,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Replied',
      value: analytics.replied,
      percentage: ((analytics.replied / total) * 100).toFixed(1),
      icon: MessageSquare,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
    {
      label: 'Clicked',
      value: analytics.clicked,
      percentage: ((analytics.clicked / total) * 100).toFixed(1),
      icon: MousePointer,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      label: 'Failed',
      value: analytics.failed,
      percentage: ((analytics.failed / total) * 100).toFixed(1),
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ];

  const getStatusBadge = () => {
    switch (campaign.status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-sm text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
            <CheckCircle className="h-4 w-4" /> Completed
          </span>
        );
      case 'running':
        return (
          <span className="flex items-center gap-1 text-sm text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">
            <TrendingUp className="h-4 w-4 animate-pulse" /> Running
          </span>
        );
      case 'scheduled':
        return (
          <span className="flex items-center gap-1 text-sm text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full">
            <Clock className="h-4 w-4" /> Scheduled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">{campaign.name}</h2>
          <p className="text-muted-foreground">{campaign.description}</p>
        </div>
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4">
              <div className={`p-2 ${stat.bgColor} rounded-lg w-fit mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              {stat.percentage && (
                <p className={`text-xs ${stat.color}`}>{stat.percentage}%</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Funnel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivered</span>
              <span className="font-medium text-foreground">
                {((analytics.delivered / total) * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={(analytics.delivered / total) * 100} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Read</span>
              <span className="font-medium text-foreground">
                {((analytics.read / total) * 100).toFixed(1)}%
              </span>
            </div>
            <Progress value={(analytics.read / total) * 100} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Engagement (Replied + Clicked)</span>
              <span className="font-medium text-foreground">
                {(((analytics.replied + analytics.clicked) / total) * 100).toFixed(1)}%
              </span>
            </div>
            <Progress
              value={((analytics.replied + analytics.clicked) / total) * 100}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {campaign.scheduledAt && (
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Scheduled</p>
                <p className="font-medium text-foreground">
                  {new Date(campaign.scheduledAt).toLocaleString()}
                </p>
              </div>
              {campaign.startedAt && (
                <div>
                  <p className="text-muted-foreground">Started</p>
                  <p className="font-medium text-foreground">
                    {new Date(campaign.startedAt).toLocaleString()}
                  </p>
                </div>
              )}
              {campaign.completedAt && (
                <div>
                  <p className="text-muted-foreground">Completed</p>
                  <p className="font-medium text-foreground">
                    {new Date(campaign.completedAt).toLocaleString()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium text-foreground">
                  {campaign.startedAt && campaign.completedAt
                    ? `${Math.round(
                        (new Date(campaign.completedAt).getTime() -
                          new Date(campaign.startedAt).getTime()) /
                          60000
                      )} mins`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignAnalytics;
