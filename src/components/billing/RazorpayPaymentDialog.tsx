import { useState, useEffect } from "react";
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
import { Loader2, IndianRupee, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayPaymentDialog = ({
  open,
  onOpenChange,
  plan,
  onPaymentSuccess,
}: RazorpayPaymentDialogProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success' | 'error'>('details');
  const [errorMessage, setErrorMessage] = useState('');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Convert USD to INR (approximate rate)
  const inrPrice = plan ? Math.round(plan.price * 83) : 0;

  // Load Razorpay script
  useEffect(() => {
    if (open && !isScriptLoaded) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay script loaded');
        setIsScriptLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        toast.error('Failed to load payment gateway');
      };
      document.body.appendChild(script);

      return () => {
        // Cleanup is optional as script is cached
      };
    }
  }, [open, isScriptLoaded]);

  const handlePayment = async () => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      toast.error('Please fill in all details');
      return;
    }

    if (!isScriptLoaded || !window.Razorpay) {
      toast.error('Payment gateway not loaded. Please try again.');
      return;
    }

    setIsProcessing(true);
    setPaymentStep('processing');
    setErrorMessage('');

    try {
      // Create order via edge function
      console.log('Creating Razorpay order...');
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        'razorpay/create-order',
        {
          body: {
            amount: inrPrice,
            currency: 'INR',
            receipt: `plan_${plan?.id}_${Date.now()}`,
            notes: {
              plan_id: plan?.id || '',
              plan_name: plan?.name || '',
              customer_email: customerDetails.email,
            },
          },
        }
      );

      if (orderError || !orderData) {
        throw new Error(orderError?.message || 'Failed to create order');
      }

      console.log('Order created:', orderData);

      // Get Razorpay key
      const { data: keyData } = await supabase.functions.invoke('razorpay/get-key');
      const razorpayKeyId = keyData?.key_id;

      if (!razorpayKeyId) {
        throw new Error('Failed to get payment gateway key');
      }

      // Initialize Razorpay checkout
      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'WhatsApp Business Platform',
        description: `${plan?.name} Plan Subscription`,
        order_id: orderData.id,
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone,
        },
        notes: {
          plan_id: plan?.id,
        },
        theme: {
          color: '#3B82F6',
        },
        handler: async (response: any) => {
          console.log('Payment successful:', response);
          await verifyPayment(response);
        },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user');
            setIsProcessing(false);
            setPaymentStep('details');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        setErrorMessage(response.error.description || 'Payment failed');
        setPaymentStep('error');
        setIsProcessing(false);
      });

      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      const message = error instanceof Error ? error.message : 'Payment failed';
      setErrorMessage(message);
      setPaymentStep('error');
      setIsProcessing(false);
      toast.error(message);
    }
  };

  const verifyPayment = async (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    try {
      console.log('Verifying payment...');
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
        'razorpay/verify-payment',
        {
          body: response,
        }
      );

      if (verifyError || !verifyData?.verified) {
        throw new Error(verifyError?.message || 'Payment verification failed');
      }

      console.log('Payment verified:', verifyData);
      setPaymentStep('success');
      setIsProcessing(false);

      setTimeout(() => {
        toast.success('Payment successful! Your subscription is now active.');
        onPaymentSuccess();
        onOpenChange(false);
        resetState();
      }, 1500);
    } catch (error) {
      console.error('Verification error:', error);
      const message = error instanceof Error ? error.message : 'Verification failed';
      setErrorMessage(message);
      setPaymentStep('error');
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setPaymentStep('details');
    setCustomerDetails({ name: '', email: '', phone: '' });
    setErrorMessage('');
  };

  const handleClose = () => {
    if (!isProcessing) {
      onOpenChange(false);
      resetState();
    }
  };

  const handleRetry = () => {
    setPaymentStep('details');
    setErrorMessage('');
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
              disabled={!isScriptLoaded}
            >
              {!isScriptLoaded ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                `Pay ₹${inrPrice.toLocaleString()}`
              )}
            </Button>
          </div>
        )}

        {paymentStep === 'processing' && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
            <div>
              <p className="font-semibold text-foreground">Processing Payment</p>
              <p className="text-sm text-muted-foreground">Please complete the payment in the Razorpay window...</p>
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

        {paymentStep === 'error' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Payment Failed</p>
              <p className="text-sm text-muted-foreground">{errorMessage || 'Something went wrong'}</p>
            </div>
            <Button onClick={handleRetry} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RazorpayPaymentDialog;
