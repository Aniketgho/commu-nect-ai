import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Download, 
  Check, 
  Zap,
  MessageSquare,
  Users,
  Bot,
  TrendingUp,
  Calendar,
  FileText,
  AlertCircle,
  ChevronRight,
  Sparkles
} from "lucide-react";

const Billing = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 19,
      period: 'month',
      description: 'Perfect for small businesses',
      features: [
        '5,000 messages/month',
        '1,000 contacts',
        '1 team member',
        'Basic AI responses',
        'Email support',
      ],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 49,
      period: 'month',
      description: 'Best for growing teams',
      features: [
        '50,000 messages/month',
        '10,000 contacts',
        '5 team members',
        'Advanced AI automation',
        'Priority support',
        'Custom workflows',
        'Analytics dashboard',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 149,
      period: 'month',
      description: 'For large organizations',
      features: [
        'Unlimited messages',
        'Unlimited contacts',
        'Unlimited team members',
        'Custom AI training',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'White-label option',
      ],
      popular: false,
    },
  ];

  const usage = [
    { 
      label: 'Messages Sent', 
      value: 12458, 
      limit: 50000, 
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      label: 'Active Contacts', 
      value: 3240, 
      limit: 10000, 
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      label: 'AI Responses', 
      value: 8920, 
      limit: 20000, 
      icon: Bot,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    { 
      label: 'Campaigns', 
      value: 12, 
      limit: 50, 
      icon: Zap,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10'
    },
  ];

  const invoices = [
    { id: 'INV-2024-012', date: 'Dec 24, 2024', amount: 49.00, status: 'Paid' },
    { id: 'INV-2024-011', date: 'Nov 24, 2024', amount: 49.00, status: 'Paid' },
    { id: 'INV-2024-010', date: 'Oct 24, 2024', amount: 49.00, status: 'Paid' },
    { id: 'INV-2024-009', date: 'Sep 24, 2024', amount: 49.00, status: 'Paid' },
    { id: 'INV-2024-008', date: 'Aug 24, 2024', amount: 49.00, status: 'Paid' },
  ];

  const currentPlan = plans.find(p => p.id === 'pro');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Billing & Usage</h1>
            <p className="text-muted-foreground">Manage your subscription and track usage</p>
          </div>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Download All Invoices
          </Button>
        </div>

        {/* Current Plan Card */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-foreground">{currentPlan?.name} Plan</h2>
                    <Badge className="bg-primary">Current</Badge>
                  </div>
                  <p className="text-muted-foreground">${currentPlan?.price}/month • Billed monthly</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Next billing date</p>
                  <p className="font-medium text-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    January 24, 2025
                  </p>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="flex gap-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="ghost" className="text-destructive hover:text-destructive">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Usage This Billing Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {usage.map((item) => {
              const percent = Math.round((item.value / item.limit) * 100);
              return (
                <Card key={item.label} className="border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${item.bgColor}`}>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="text-xl font-bold text-foreground">
                          {item.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Progress value={percent} className="h-2" />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{percent}% used</span>
                      <span className="text-xs text-muted-foreground">
                        {item.limit.toLocaleString()} limit
                      </span>
                    </div>
                    {percent > 80 && (
                      <div className="flex items-center gap-1 mt-2 text-amber-500 text-xs">
                        <AlertCircle className="h-3 w-3" />
                        <span>Approaching limit</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Plans Comparison */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`border-border relative transition-all hover:shadow-lg ${
                  plan.popular ? 'border-primary ring-1 ring-primary' : ''
                } ${selectedPlan === plan.id ? 'bg-muted/30' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary shadow-lg">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-xl text-foreground">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-4"
                    variant={plan.id === 'pro' ? 'default' : 'outline'}
                    disabled={plan.id === 'pro'}
                  >
                    {plan.id === 'pro' ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Method & Invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Method */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                  </div>
                </div>
                <Badge variant="outline">Default</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">Update Card</Button>
                <Button variant="outline" className="flex-1">Add New Card</Button>
              </div>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Billing Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <p className="font-medium text-foreground">Acme Inc</p>
                <p className="text-muted-foreground">123 Business Street</p>
                <p className="text-muted-foreground">Suite 100</p>
                <p className="text-muted-foreground">San Francisco, CA 94105</p>
                <p className="text-muted-foreground">United States</p>
              </div>
              <Button variant="outline" className="w-full mt-4">Update Address</Button>
            </CardContent>
          </Card>
        </div>

        {/* Invoice History */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="h-5 w-5 text-primary" />
                Invoice History
              </CardTitle>
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Invoice</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-medium text-foreground">{invoice.id}</p>
                      </td>
                      <td className="py-4 px-4 text-foreground">{invoice.date}</td>
                      <td className="py-4 px-4 text-foreground font-medium">${invoice.amount.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Download className="h-4 w-4" />
                          PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
