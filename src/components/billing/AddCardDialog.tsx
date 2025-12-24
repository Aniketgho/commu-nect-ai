import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

interface PaymentCard {
  id: string;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
}

interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCard: (card: PaymentCard) => void;
}

const AddCardDialog = ({ open, onOpenChange, onAddCard }: AddCardDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const getCardBrand = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'VISA';
    if (/^5[1-5]/.test(cleaned)) return 'MC';
    if (/^3[47]/.test(cleaned)) return 'AMEX';
    if (/^6(?:011|5)/.test(cleaned)) return 'DISC';
    return 'CARD';
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const cardNum = formData.cardNumber.replace(/\s/g, '');
    
    if (!cardNum || cardNum.length < 15) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    if (!formData.expiry || formData.expiry.length < 5) {
      newErrors.expiry = 'Please enter a valid expiry date';
    }
    if (!formData.cvc || formData.cvc.length < 3) {
      newErrors.cvc = 'Please enter a valid CVC';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter the cardholder name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const cardNum = formData.cardNumber.replace(/\s/g, '');
    const [expMonth, expYear] = formData.expiry.split('/');

    onAddCard({
      id: Date.now().toString(),
      brand: getCardBrand(cardNum),
      last4: cardNum.slice(-4),
      expMonth,
      expYear: '20' + expYear,
      isDefault: false,
    });

    setIsLoading(false);
    onOpenChange(false);
    setFormData({ cardNumber: '', expiry: '', cvc: '', name: '' });
    toast.success('Card added successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Add Payment Card
          </DialogTitle>
          <DialogDescription>
            Enter your card details to add a new payment method
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => setFormData({ 
                ...formData, 
                cardNumber: formatCardNumber(e.target.value) 
              })}
              maxLength={19}
              className={errors.cardNumber ? 'border-destructive' : ''}
            />
            {errors.cardNumber && (
              <p className="text-sm text-destructive">{errors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  expiry: formatExpiry(e.target.value) 
                })}
                maxLength={5}
                className={errors.expiry ? 'border-destructive' : ''}
              />
              {errors.expiry && (
                <p className="text-sm text-destructive">{errors.expiry}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={formData.cvc}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  cvc: e.target.value.replace(/\D/g, '').slice(0, 4) 
                })}
                maxLength={4}
                className={errors.cvc ? 'border-destructive' : ''}
              />
              {errors.cvc && (
                <p className="text-sm text-destructive">{errors.cvc}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Cardholder Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <p>🔒 Your card information is encrypted and secure</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Adding Card...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;
