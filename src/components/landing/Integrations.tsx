import { Zap, ShoppingBag, Store, Mail, Calendar, Database, CreditCard, MessageCircle } from "lucide-react";

const Integrations = () => {
  const integrations = [
    {
      name: "Shopify",
      description: "Sync products, orders & customers",
      icon: ShoppingBag,
      color: "bg-[#96BF48]/20 text-[#96BF48]",
    },
    {
      name: "WooCommerce",
      description: "WordPress e-commerce integration",
      icon: Store,
      color: "bg-[#9B5C8F]/20 text-[#9B5C8F]",
    },
    {
      name: "Zapier",
      description: "Connect 5,000+ apps automatically",
      icon: Zap,
      color: "bg-[#FF4A00]/20 text-[#FF4A00]",
    },
    {
      name: "Stripe",
      description: "Process payments seamlessly",
      icon: CreditCard,
      color: "bg-[#635BFF]/20 text-[#635BFF]",
    },
    {
      name: "HubSpot",
      description: "CRM & marketing automation",
      icon: Database,
      color: "bg-[#FF7A59]/20 text-[#FF7A59]",
    },
    {
      name: "Mailchimp",
      description: "Email marketing campaigns",
      icon: Mail,
      color: "bg-[#FFE01B]/20 text-[#FFE01B]",
    },
    {
      name: "Calendly",
      description: "Schedule appointments via chat",
      icon: Calendar,
      color: "bg-[#006BFF]/20 text-[#006BFF]",
    },
    {
      name: "Intercom",
      description: "Customer support handoff",
      icon: MessageCircle,
      color: "bg-[#1F8DED]/20 text-[#1F8DED]",
    },
  ];

  return (
    <section id="integrations" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Seamless Integrations
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Connect With Your</span>
            <br />
            <span className="gradient-text">Favorite Tools</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            WhatsFlow integrates with the tools you already use. Automate workflows,
            sync data, and build powerful customer experiences.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {integrations.map((integration, index) => (
            <div
              key={integration.name}
              className="group glass-card p-6 text-center hover-lift cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`inline-flex p-4 rounded-2xl ${integration.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <integration.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {integration.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {integration.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Don't see your tool? <span className="text-primary hover:underline cursor-pointer">Request an integration</span> or use our{" "}
            <span className="text-primary hover:underline cursor-pointer">API</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
