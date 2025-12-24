import { Button } from "@/components/ui/button";
import { Check, Zap, Building2, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      icon: Zap,
      price: "$49",
      period: "/month",
      description: "Perfect for small businesses getting started with WhatsApp marketing.",
      features: [
        "1 WhatsApp Number",
        "5,000 conversations/month",
        "2 Team Members",
        "Basic AI Chatbot",
        "Template Management",
        "Email Support",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Professional",
      icon: Rocket,
      price: "$149",
      period: "/month",
      description: "For growing teams that need advanced automation and analytics.",
      features: [
        "3 WhatsApp Numbers",
        "25,000 conversations/month",
        "10 Team Members",
        "Advanced AI Agents",
        "Flow Builder",
        "CRM Integration",
        "API Access",
        "Priority Support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      icon: Building2,
      price: "Custom",
      period: "",
      description: "For large organizations with custom requirements and SLAs.",
      features: [
        "Unlimited Numbers",
        "Unlimited Conversations",
        "Unlimited Team Members",
        "Custom AI Training",
        "White-Label Option",
        "Dedicated Account Manager",
        "Custom Integrations",
        "99.9% SLA",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Simple Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Plans That Scale</span>
            <br />
            <span className="gradient-text">With Your Business</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when ready. All plans include Meta API fees — no hidden costs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative glass-card p-8 ${
                plan.popular 
                  ? 'ring-2 ring-primary glow-effect scale-105 z-10' 
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <plan.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
              </div>

              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <p className="text-muted-foreground text-sm mb-6">
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/signup" className="block">
                <Button 
                  variant={plan.popular ? "hero" : "glass"} 
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            🔒 30-day money-back guarantee • No credit card required for trial
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
