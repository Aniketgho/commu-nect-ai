import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
}

interface ChangePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlanId: string;
  plans: Plan[];
  onChangePlan: (planId: string) => void;
}

const ChangePlanDialog = ({ open, onOpenChange, currentPlanId, plans, onChangePlan }: ChangePlanDialogProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentPlan = plans.find(p => p.id === currentPlanId);
  const newPlan = plans.find(p => p.id === selectedPlan);

  const handleConfirm = async () => {
    if (!selectedPlan) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onChangePlan(selectedPlan);
    setIsLoading(false);
    onOpenChange(false);
    setSelectedPlan(null);
    
    const plan = plans.find(p => p.id === selectedPlan);
    toast.success(`Successfully switched to ${plan?.name} plan!`);
  };

  const isUpgrade = newPlan && currentPlan && newPlan.price > currentPlan.price;
  const isDowngrade = newPlan && currentPlan && newPlan.price < currentPlan.price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Change Your Plan
          </DialogTitle>
          <DialogDescription>
            Select a new plan that fits your needs
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => plan.id !== currentPlanId && setSelectedPlan(plan.id)}
              className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                plan.id === currentPlanId
                  ? 'border-muted bg-muted/30 cursor-not-allowed opacity-60'
                  : selectedPlan === plan.id
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {plan.popular && plan.id !== currentPlanId && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary">
                  Popular
                </Badge>
              )}
              {plan.id === currentPlanId && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2" variant="secondary">
                  Current
                </Badge>
              )}
              
              <div className="text-center pt-2">
                <h3 className="font-semibold text-foreground">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <ul className="mt-4 space-y-2">
                {plan.features.slice(0, 4).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
                {plan.features.length > 4 && (
                  <li className="text-sm text-muted-foreground">
                    +{plan.features.length - 4} more features
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className={`p-4 rounded-lg ${
            isUpgrade ? 'bg-emerald-500/10 border border-emerald-500/30' : 
            isDowngrade ? 'bg-amber-500/10 border border-amber-500/30' : ''
          }`}>
            {isUpgrade && (
              <div className="text-sm">
                <p className="font-medium text-emerald-600">Upgrading to {newPlan?.name}</p>
                <p className="text-muted-foreground">
                  You'll be charged ${newPlan?.price}/month. The new plan will be active immediately.
                </p>
              </div>
            )}
            {isDowngrade && (
              <div className="text-sm">
                <p className="font-medium text-amber-600">Downgrading to {newPlan?.name}</p>
                <p className="text-muted-foreground">
                  Your new plan will take effect at the start of your next billing cycle.
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedPlan || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              'Confirm Change'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePlanDialog;
