import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  MessageSquare, 
  Bot, 
  Zap, 
  BarChart3,
  CheckCircle2,
  Play
} from "lucide-react";

const Hero = () => {
  const stats = [
    { value: "50M+", label: "Messages Sent" },
    { value: "10K+", label: "Active Businesses" },
    { value: "99.9%", label: "Uptime" },
    { value: "150+", label: "Countries" },
  ];

  const features = [
    "Official WhatsApp Business API",
    "AI-Powered Automation",
    "Team Inbox & CRM",
    "No-Code Flow Builder",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
      
      {/* Animated Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fade-up">
            <Zap className="h-4 w-4" />
            <span>AI-First WhatsApp Business Platform</span>
            <ArrowRight className="h-4 w-4" />
          </div>

          {/* Headline */}
          <div className="space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-foreground">Scale Your Business with</span>
              <br />
              <span className="gradient-text">WhatsApp Automation</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The most powerful WhatsApp Business API platform. Run campaigns, automate conversations, 
              deploy AI agents, and manage your team inbox — all in one place.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {features.map((feature) => (
              <div 
                key={feature}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {feature}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/signup">
              <Button variant="hero" size="xl" className="group">
                Start Free Trial
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="glass" size="xl" className="gap-2">
              <Play className="h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Hero Visual */}
          <div className="relative mt-16 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="absolute inset-0 bg-gradient-glow" />
            <div className="relative glass-card p-2 md:p-4 mx-auto max-w-5xl glow-effect">
              <div className="bg-background rounded-lg overflow-hidden border border-border/50">
                {/* Mock Dashboard */}
                <div className="bg-card p-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-primary/60" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="px-4 py-1 bg-muted rounded-md text-xs text-muted-foreground">
                        app.whatsflow.io/dashboard
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Stats Cards */}
                  <div className="glass-card p-4 hover-lift">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Messages Today</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">24,583</div>
                    <div className="text-xs text-primary mt-1">↑ 12.5% from yesterday</div>
                  </div>
                  <div className="glass-card p-4 hover-lift">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Bot className="h-5 w-5 text-emerald-500" />
                      </div>
                      <span className="text-sm text-muted-foreground">AI Responses</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">18,291</div>
                    <div className="text-xs text-emerald-500 mt-1">74% automation rate</div>
                  </div>
                  <div className="glass-card p-4 hover-lift">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-blue-500" />
                      </div>
                      <span className="text-sm text-muted-foreground">Conversion Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">32.4%</div>
                    <div className="text-xs text-blue-500 mt-1">↑ 4.2% this week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
