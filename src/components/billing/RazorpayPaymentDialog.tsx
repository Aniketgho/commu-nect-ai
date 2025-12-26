import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, IndianRupee, Shield, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
}

interface RazorpayPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan | null;
  onPaymentSuccess: () => void;
}

const RazorpayPaymentDialog = ({
  open,
  onOpenChange,
  plan,
  onPaymentSuccess,
}: RazorpayPaymentDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Convert USD to INR (approximate rate)
  const inrPrice = plan ? Math.round(plan.price * 83) : 0;

  const handlePayment = async () => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      toast.error('Please fill in all details');
      return;
    }

    setIsProcessing(true);
    setPaymentStep('processing');

    // Simulate Razorpay payment processing
    // In production, you would integrate with actual Razorpay SDK
    await new Promise(resolve => setTimeout(resolve, 2000));

    setPaymentStep('success');
    setIsProcessing(false);

    setTimeout(() => {
      toast.success('Payment successful! Your subscription is now active.');
      onPaymentSuccess();
      onOpenChange(false);
      setPaymentStep('details');
      setCustomerDetails({ name: '', email: '', phone: '' });
    }, 1500);
  };

  const handleClose = () => {
    if (!isProcessing) {
      onOpenChange(false);
      setPaymentStep('details');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <IndianRupee className="h-5 w-5 text-blue-500" />
            </div>
            Pay with Razorpay
          </DialogTitle>
          <DialogDescription>
            Complete your payment securely using Razorpay
          </DialogDescription>
        </DialogHeader>

        {paymentStep === 'details' && (
          <div className="space-y-6 py-4">
            {/* Plan Summary */}
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Selected Plan</span>
                <Badge>{plan?.name}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">Total Amount</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    {inrPrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">≈ ${plan?.price}/month</p>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rzp-name">Full Name</Label>
                <Input
                  id="rzp-name"
                  placeholder="Enter your full name"
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rzp-email">Email</Label>
                <Input
                  id="rzp-email"
                  type="email"
                  placeholder="Enter your email"
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rzp-phone">Phone Number</Label>
                <Input
                  id="rzp-phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Supported Payment Methods</p>
              <div className="flex flex-wrap gap-2">
                {['UPI', 'Cards', 'Net Banking', 'Wallets'].map((method) => (
                  <Badge key={method} variant="outline" className="text-xs">
                    {method}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Secured by Razorpay • 256-bit encryption</span>
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              size="lg"
              onClick={handlePayment}
            >
              Pay ₹{inrPrice.toLocaleString()}
            </Button>
          </div>
        )}

        {paymentStep === 'processing' && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
            <div>
              <p className="font-semibold text-foreground">Processing Payment</p>
              <p className="text-sm text-muted-foreground">Please wait while we process your payment...</p>
            </div>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Payment Successful!</p>
              <p className="text-sm text-muted-foreground">Your {plan?.name} plan is now active</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RazorpayPaymentDialog;
