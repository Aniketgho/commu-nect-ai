-- Create message_analytics table for tracking message events
CREATE TABLE public.message_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  phone_number_id UUID REFERENCES public.phone_numbers(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'sent', 'delivered', 'read', 'clicked', 'failed'
  campaign_id UUID,
  message_id UUID,
  device_type TEXT, -- 'mobile', 'desktop', 'tablet'
  response_time_seconds INTEGER, -- time to respond in seconds
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaigns table for campaign management
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaign_analytics table for aggregated campaign stats
CREATE TABLE public.campaign_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  messages_sent INTEGER NOT NULL DEFAULT 0,
  messages_delivered INTEGER NOT NULL DEFAULT 0,
  messages_read INTEGER NOT NULL DEFAULT 0,
  messages_clicked INTEGER NOT NULL DEFAULT 0,
  messages_failed INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, date)
);

-- Create daily_analytics for aggregated daily stats
CREATE TABLE public.daily_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  messages_sent INTEGER NOT NULL DEFAULT 0,
  messages_delivered INTEGER NOT NULL DEFAULT 0,
  messages_read INTEGER NOT NULL DEFAULT 0,
  messages_clicked INTEGER NOT NULL DEFAULT 0,
  messages_failed INTEGER NOT NULL DEFAULT 0,
  conversations_started INTEGER NOT NULL DEFAULT 0,
  active_users INTEGER NOT NULL DEFAULT 0,
  avg_response_time_seconds INTEGER NOT NULL DEFAULT 0,
  device_mobile INTEGER NOT NULL DEFAULT 0,
  device_desktop INTEGER NOT NULL DEFAULT 0,
  device_tablet INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.message_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for message_analytics
CREATE POLICY "Users can view their own message analytics"
ON public.message_analytics FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own message analytics"
ON public.message_analytics FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS policies for campaigns
CREATE POLICY "Users can view their own campaigns"
ON public.campaigns FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own campaigns"
ON public.campaigns FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
ON public.campaigns FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
ON public.campaigns FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for campaign_analytics
CREATE POLICY "Users can view their own campaign analytics"
ON public.campaign_analytics FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own campaign analytics"
ON public.campaign_analytics FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaign analytics"
ON public.campaign_analytics FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for daily_analytics
CREATE POLICY "Users can view their own daily analytics"
ON public.daily_analytics FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily analytics"
ON public.daily_analytics FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily analytics"
ON public.daily_analytics FOR UPDATE
USING (auth.uid() = user_id);

-- Create updated_at trigger for campaigns
CREATE TRIGGER update_campaigns_updated_at
BEFORE UPDATE ON public.campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_message_analytics_user_id ON public.message_analytics(user_id);
CREATE INDEX idx_message_analytics_created_at ON public.message_analytics(created_at);
CREATE INDEX idx_campaign_analytics_user_id ON public.campaign_analytics(user_id);
CREATE INDEX idx_campaign_analytics_date ON public.campaign_analytics(date);
CREATE INDEX idx_daily_analytics_user_id_date ON public.daily_analytics(user_id, date);