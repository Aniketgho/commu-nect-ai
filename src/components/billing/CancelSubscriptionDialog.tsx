import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  billingEndDate: string;
  onCancel: () => void;
}

const CancelSubscriptionDialog = ({ 
  open, 
  onOpenChange, 
  planName, 
  billingEndDate,
  onCancel 
}: CancelSubscriptionDialogProps) => {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const reasons = [
    { id: 'too-expensive', label: 'Too expensive' },
    { id: 'not-using', label: 'Not using it enough' },
    { id: 'missing-features', label: 'Missing features I need' },
    { id: 'switching', label: 'Switching to a competitor' },
    { id: 'temporary', label: 'Temporary pause' },
    { id: 'other', label: 'Other reason' },
  ];

  const handleConfirmCancel = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onCancel();
    setIsLoading(false);
    onOpenChange(false);
    setStep(1);
    setReason('');
    setFeedback('');
    toast.success('Subscription cancelled. You\'ll have access until the end of your billing period.');
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep(1);
    setReason('');
    setFeedback('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Cancel Subscription
          </DialogTitle>
          <DialogDescription>
            {step === 1 ? 'We\'re sorry to see you go. Please tell us why.' : 'Please confirm your cancellation.'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Why are you cancelling?</Label>
              <RadioGroup value={reason} onValueChange={setReason}>
                {reasons.map((r) => (
                  <div key={r.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={r.id} id={r.id} />
                    <Label htmlFor={r.id} className="font-normal cursor-pointer">
                      {r.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Additional feedback (optional)</Label>
              <Textarea
                id="feedback"
                placeholder="Tell us how we can improve..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">What happens when you cancel:</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• You'll have access to {planName} features until {billingEndDate}</li>
                <li>• After that, your account will be downgraded to Free</li>
                <li>• Your data will be preserved for 30 days</li>
                <li>• You can reactivate anytime</li>
              </ul>
            </div>

            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <h4 className="font-medium text-foreground mb-1">Not ready to leave?</h4>
              <p className="text-sm text-muted-foreground">
                Contact our support team for a special offer or to discuss your needs.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Talk to Support
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Never mind
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setStep(2)}
                disabled={!reason}
              >
                Continue
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Go Back
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmCancel}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Cancelling...
                  </>
                ) : (
                  'Confirm Cancellation'
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelSubscriptionDialog;
