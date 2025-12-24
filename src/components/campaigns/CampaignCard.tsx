import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Campaign } from "@/types/campaigns";
import { Send, Eye, Play, Pause, BarChart3, Calendar, Users } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
  onView: (campaign: Campaign) => void;
  onPause?: (campaign: Campaign) => void;
  onResume?: (campaign: Campaign) => void;
}

const CampaignCard = ({ campaign, onView, onPause, onResume }: CampaignCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'running':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'scheduled':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'paused':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'draft':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const { analytics } = campaign;
  const deliveryRate = analytics.sent > 0 ? ((analytics.delivered / analytics.sent) * 100).toFixed(1) : '0';
  const engagementRate = analytics.sent > 0 
    ? (((analytics.replied + analytics.clicked) / analytics.sent) * 100).toFixed(1) 
    : '0';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-lg">{campaign.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{campaign.description}</p>
          </div>
          <Badge className={getStatusColor(campaign.status)} variant="outline">
            {campaign.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {campaign.scheduledAt && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {campaign.status === 'scheduled' ? 'Scheduled: ' : 'Sent: '}
              {new Date(campaign.scheduledAt).toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Send className="h-3 w-3 text-muted-foreground" />
            </div>
            <p className="text-lg font-bold text-foreground">{analytics.sent.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Sent</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BarChart3 className="h-3 w-3 text-muted-foreground" />
            </div>
            <p className="text-lg font-bold text-foreground">{deliveryRate}%</p>
            <p className="text-xs text-muted-foreground">Delivered</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-3 w-3 text-muted-foreground" />
            </div>
            <p className="text-lg font-bold text-foreground">{engagementRate}%</p>
            <p className="text-xs text-muted-foreground">Engagement</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(campaign)}>
            <Eye className="h-4 w-4 mr-1" /> View Details
          </Button>
          {campaign.status === 'running' && onPause && (
            <Button variant="outline" size="sm" onClick={() => onPause(campaign)}>
              <Pause className="h-4 w-4" />
            </Button>
          )}
          {campaign.status === 'paused' && onResume && (
            <Button variant="outline" size="sm" onClick={() => onResume(campaign)}>
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
