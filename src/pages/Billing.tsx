import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AddCardDialog from "@/components/billing/AddCardDialog";
import ChangePlanDialog from "@/components/billing/ChangePlanDialog";
import CancelSubscriptionDialog from "@/components/billing/CancelSubscriptionDialog";
import RazorpayPaymentDialog from "@/components/billing/RazorpayPaymentDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Download, 
  Check, 
  Zap,
  MessageSquare,
  Users,
  Bot,
  Calendar,
  FileText,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Trash2,
  Star,
  Plus,
  Edit2,
  Loader2,
  IndianRupee
} from "lucide-react";
import { toast } from "sonner";

interface PaymentCard {
  id: string;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
}

const Billing = () => {
  const [currentPlanId, setCurrentPlanId] = useState('pro');
  const [isCancelled, setIsCancelled] = useState(false);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [showChangePlanDialog, setShowChangePlanDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showRazorpayDialog, setShowRazorpayDialog] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<typeof plans[0] | null>(null);
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);

  const [cards, setCards] = useState<PaymentCard[]>([
    {
      id: '1',
      brand: 'VISA',
      last4: '4242',
      expMonth: '12',
      expYear: '2026',
      isDefault: true,
    },
  ]);

  const [billingAddress, setBillingAddress] = useState({
    company: 'Acme Inc',
    address1: '123 Business Street',
    address2: 'Suite 100',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States',
  });

  const [editAddress, setEditAddress] = useState(billingAddress);

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
      limit: currentPlanId === 'starter' ? 5000 : currentPlanId === 'pro' ? 50000 : 999999, 
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      label: 'Active Contacts', 
      value: 3240, 
      limit: currentPlanId === 'starter' ? 1000 : currentPlanId === 'pro' ? 10000 : 999999, 
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      label: 'AI Responses', 
      value: 8920, 
      limit: currentPlanId === 'starter' ? 2000 : currentPlanId === 'pro' ? 20000 : 999999, 
      icon: Bot,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    { 
      label: 'Campaigns', 
      value: 12, 
      limit: currentPlanId === 'starter' ? 10 : currentPlanId === 'pro' ? 50 : 999999, 
      icon: Zap,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10'
    },
  ];

  const [invoices, setInvoices] = useState([
    { id: 'INV-2024-012', date: 'Dec 24, 2024', amount: 49.00, status: 'Paid' },
    { id: 'INV-2024-011', date: 'Nov 24, 2024', amount: 49.00, status: 'Paid' },
    { id: 'INV-2024-010', date: 'Oct 24, 2024', amount: 49.00, status: 'Paid' },
    { id: 'INV-2024-009', date: 'Sep 24, 2024', amount: 49.00, status: 'Paid' },
    { id: 'INV-2024-008', date: 'Aug 24, 2024', amount: 49.00, status: 'Paid' },
  ]);

  const currentPlan = plans.find(p => p.id === currentPlanId);

  const handleAddCard = (card: PaymentCard) => {
    setCards(prev => [...prev, card]);
  };

  const handleSetDefaultCard = (cardId: string) => {
    setCards(prev => prev.map(c => ({
      ...c,
      isDefault: c.id === cardId,
    })));
    toast.success('Default payment method updated');
  };

  const handleDeleteCard = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (card?.isDefault) {
      toast.error('Cannot delete the default payment method');
      return;
    }
    setCards(prev => prev.filter(c => c.id !== cardId));
    toast.success('Card removed');
  };

  const handleChangePlan = (planId: string) => {
    setCurrentPlanId(planId);
    setIsCancelled(false);
  };

  const handleCancelSubscription = () => {
    setIsCancelled(true);
  };

  const handleReactivate = () => {
    setIsCancelled(false);
    toast.success('Subscription reactivated!');
  };

  const handleUpdateAddress = async () => {
    setIsUpdatingAddress(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setBillingAddress(editAddress);
    setIsUpdatingAddress(false);
    setShowAddressDialog(false);
    toast.success('Billing address updated');
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading ${invoiceId}...`);
  };

  const getCardBrandColor = (brand: string) => {
    switch (brand) {
      case 'VISA': return 'from-blue-600 to-blue-800';
      case 'MC': return 'from-red-500 to-orange-500';
      case 'AMEX': return 'from-blue-400 to-blue-600';
      default: return 'from-gray-600 to-gray-800';
    }
  };

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
        <Card className={`border-2 ${isCancelled ? 'border-amber-500/50 bg-amber-500/5' : 'border-primary/20 bg-gradient-to-r from-primary/5 to-transparent'}`}>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isCancelled ? 'bg-amber-500/10' : 'bg-primary/10'}`}>
                  <Sparkles className={`h-8 w-8 ${isCancelled ? 'text-amber-500' : 'text-primary'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-foreground">{currentPlan?.name} Plan</h2>
                    {isCancelled ? (
                      <Badge variant="outline" className="border-amber-500 text-amber-500">
                        Cancelling
                      </Badge>
                    ) : (
                      <Badge className="bg-primary">Active</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    ${currentPlan?.price}/month • Billed monthly
                  </p>
                  {isCancelled && (
                    <p className="text-sm text-amber-500 mt-1">
                      Your subscription will end on January 24, 2025
                    </p>
                  )}
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
                  {isCancelled ? (
                    <Button onClick={handleReactivate}>
                      Reactivate Plan
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setShowChangePlanDialog(true)}>
                        Change Plan
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => setShowCancelDialog(true)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
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
              const percent = item.limit === 999999 ? 0 : Math.round((item.value / item.limit) * 100);
              const isUnlimited = item.limit === 999999;
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
                    <Progress value={isUnlimited ? 0 : percent} className="h-2" />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {isUnlimited ? 'Unlimited' : `${percent}% used`}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isUnlimited ? '∞' : item.limit.toLocaleString()} limit
                      </span>
                    </div>
                    {!isUnlimited && percent > 80 && (
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
                  plan.id === currentPlanId ? 'border-primary ring-1 ring-primary' : ''
                }`}
              >
                {plan.popular && plan.id !== currentPlanId && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary shadow-lg">Most Popular</Badge>
                  </div>
                )}
                {plan.id === currentPlanId && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-500 shadow-lg">Current Plan</Badge>
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
                    variant={plan.id === currentPlanId ? 'secondary' : plan.popular ? 'default' : 'outline'}
                    disabled={plan.id === currentPlanId}
                    onClick={() => setShowChangePlanDialog(true)}
                  >
                    {plan.id === currentPlanId ? 'Current Plan' : 
                     plan.price > (currentPlan?.price || 0) ? 'Upgrade' : 'Downgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Method & Billing Address */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Methods
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="gap-1 border-blue-500 text-blue-500 hover:bg-blue-500/10"
                  onClick={() => {
                    setSelectedPlanForPayment(plans.find(p => p.id === currentPlanId) || null);
                    setShowRazorpayDialog(true);
                  }}
                >
                  <IndianRupee className="h-4 w-4" /> Razorpay
                </Button>
                <Button size="sm" onClick={() => setShowAddCardDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Card
                </Button>
              </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {cards.map((card) => (
                <div 
                  key={card.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-9 bg-gradient-to-r ${getCardBrandColor(card.brand)} rounded flex items-center justify-center text-white text-xs font-bold`}>
                      {card.brand}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">•••• •••• •••• {card.last4}</p>
                      <p className="text-sm text-muted-foreground">Expires {card.expMonth}/{card.expYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {card.isDefault ? (
                      <Badge variant="outline" className="border-primary text-primary">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Default
                      </Badge>
                    ) : (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSetDefaultCard(card.id)}
                        >
                          Set Default
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteCard(card.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {cards.length === 0 && (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No payment methods added</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowAddCardDialog(true)}
                  >
                    Add Payment Method
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Billing Address</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setEditAddress(billingAddress);
                    setShowAddressDialog(true);
                  }}
                >
                  <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <p className="font-medium text-foreground">{billingAddress.company}</p>
                <p className="text-muted-foreground">{billingAddress.address1}</p>
                {billingAddress.address2 && (
                  <p className="text-muted-foreground">{billingAddress.address2}</p>
                )}
                <p className="text-muted-foreground">
                  {billingAddress.city}, {billingAddress.state} {billingAddress.zip}
                </p>
                <p className="text-muted-foreground">{billingAddress.country}</p>
              </div>
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
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

      {/* Dialogs */}
      <AddCardDialog
        open={showAddCardDialog}
        onOpenChange={setShowAddCardDialog}
        onAddCard={handleAddCard}
      />

      <ChangePlanDialog
        open={showChangePlanDialog}
        onOpenChange={setShowChangePlanDialog}
        currentPlanId={currentPlanId}
        plans={plans}
        onChangePlan={handleChangePlan}
      />

      <CancelSubscriptionDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        planName={currentPlan?.name || ''}
        billingEndDate="January 24, 2025"
        onCancel={handleCancelSubscription}
      />

      <RazorpayPaymentDialog
        open={showRazorpayDialog}
        onOpenChange={setShowRazorpayDialog}
        plan={selectedPlanForPayment}
        onPaymentSuccess={() => {
          if (selectedPlanForPayment) {
            setCurrentPlanId(selectedPlanForPayment.id);
            setIsCancelled(false);
          }
        }}
      />

      {/* Address Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Billing Address</DialogTitle>
            <DialogDescription>Update your billing address information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={editAddress.company}
                onChange={(e) => setEditAddress({ ...editAddress, company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address1">Address Line 1</Label>
              <Input
                id="address1"
                value={editAddress.address1}
                onChange={(e) => setEditAddress({ ...editAddress, address1: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address2">Address Line 2</Label>
              <Input
                id="address2"
                value={editAddress.address2}
                onChange={(e) => setEditAddress({ ...editAddress, address2: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={editAddress.city}
                  onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={editAddress.state}
                  onChange={(e) => setEditAddress({ ...editAddress, state: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={editAddress.zip}
                  onChange={(e) => setEditAddress({ ...editAddress, zip: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={editAddress.country}
                  onChange={(e) => setEditAddress({ ...editAddress, country: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddressDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAddress} disabled={isUpdatingAddress}>
              {isUpdatingAddress ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Address'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Billing;
