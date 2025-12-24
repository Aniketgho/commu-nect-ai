import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Clock, Zap, AlertTriangle } from "lucide-react";

interface CampaignSchedulerProps {
  onSchedule: (scheduleData: ScheduleData) => void;
}

export interface ScheduleData {
  type: 'immediate' | 'scheduled';
  date?: Date;
  time?: string;
  timezone?: string;
  throttling?: boolean;
  messagesPerSecond?: number;
}

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
];

const CampaignScheduler = ({ onSchedule }: CampaignSchedulerProps) => {
  const [scheduleType, setScheduleType] = useState<'immediate' | 'scheduled'>('immediate');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('09:00');
  const [timezone, setTimezone] = useState('UTC');
  const [throttling, setThrottling] = useState(true);
  const [messagesPerSecond, setMessagesPerSecond] = useState(30);

  const handleSchedule = () => {
    onSchedule({
      type: scheduleType,
      date,
      time,
      timezone,
      throttling,
      messagesPerSecond: throttling ? messagesPerSecond : undefined,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">When to Send</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={scheduleType}
            onValueChange={(value) => setScheduleType(value as 'immediate' | 'scheduled')}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="immediate" id="immediate" />
              <Label htmlFor="immediate" className="flex items-center gap-3 cursor-pointer flex-1">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Send Immediately</p>
                  <p className="text-sm text-muted-foreground">Start sending as soon as you launch</p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="scheduled" id="scheduled" />
              <Label htmlFor="scheduled" className="flex items-center gap-3 cursor-pointer flex-1">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Schedule for Later</p>
                  <p className="text-sm text-muted-foreground">Pick a specific date and time</p>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {scheduleType === 'scheduled' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Smart Throttling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Throttling</p>
              <p className="text-sm text-muted-foreground">
                Gradually send messages to avoid rate limits and spam flags
              </p>
            </div>
            <Switch checked={throttling} onCheckedChange={setThrottling} />
          </div>

          {throttling && (
            <div className="space-y-2 pt-4 border-t border-border">
              <Label>Messages per second: {messagesPerSecond}</Label>
              <Input
                type="range"
                min={5}
                max={100}
                value={messagesPerSecond}
                onChange={(e) => setMessagesPerSecond(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 20-50 messages/sec for optimal delivery
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button className="w-full" size="lg" onClick={handleSchedule}>
        {scheduleType === 'immediate' ? 'Launch Campaign Now' : 'Schedule Campaign'}
      </Button>
    </div>
  );
};

export default CampaignScheduler;
