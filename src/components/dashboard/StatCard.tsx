import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

const StatCard = ({
  title,
  value,
  change,
  changeType = "positive",
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
}: StatCardProps) => {
  const changeColors = {
    positive: "text-emerald-500",
    negative: "text-red-500",
    neutral: "text-muted-foreground",
  };

  return (
    <div className="glass-card p-3 sm:p-4 lg:p-6 hover-lift">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 sm:space-y-2 min-w-0">
          <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground truncate">{title}</p>
          <p className="text-lg sm:text-xl lg:text-3xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={`text-[10px] sm:text-xs lg:text-sm ${changeColors[changeType]} truncate`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-1.5 sm:p-2 lg:p-3 rounded-lg lg:rounded-xl ${iconBgColor} flex-shrink-0`}>
          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
