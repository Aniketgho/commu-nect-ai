import { 
  MessageSquare, 
  Bot, 
  Workflow, 
  Users, 
  ShoppingCart, 
  BarChart3,
  Zap,
  Shield,
  Globe
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Team Inbox",
      description: "Shared inbox with multi-agent support, chat assignment, tags, and internal notes. Handle thousands of conversations efficiently.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Bot,
      title: "AI Agents",
      description: "Deploy intelligent chatbots powered by GPT-4 & Gemini. Knowledge base, memory system, intent recognition, and human fallback.",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: Workflow,
      title: "Flow Builder",
      description: "Visual drag-and-drop automation builder. Triggers, conditions, delays, and actions — no coding required.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Zap,
      title: "Broadcast Campaigns",
      description: "Send personalized campaigns to millions. Template management, scheduling, segmentation, and detailed analytics.",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: ShoppingCart,
      title: "eCommerce Integration",
      description: "Connect Shopify, WooCommerce, and custom APIs. Abandoned cart recovery, order updates, and product catalogs.",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
    {
      icon: Users,
      title: "Built-in CRM",
      description: "Lead management with custom fields, stages, and tags. Track every interaction and conversion journey.",
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time dashboards, campaign performance, conversation insights, and revenue attribution tracking.",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Role-based access, audit logs, IP whitelisting, GDPR compliance, and end-to-end encryption.",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      icon: Globe,
      title: "Multi-Language AI",
      description: "Automatic language detection and multilingual responses. Serve customers in 100+ languages globally.",
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
    },
  ];

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Powerful Features
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Everything You Need to</span>
            <br />
            <span className="gradient-text">Dominate WhatsApp Marketing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From AI automation to team collaboration, our platform has all the tools 
            you need to grow your business on WhatsApp.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group glass-card p-6 hover-lift cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
