import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Loader2, ChevronDown, Check, AlertCircle } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AddPhoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (phoneNumber: string, label: string, countryCode?: string) => Promise<any>;
}

const countries = [
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸", format: "### ### ####", minLength: 10, maxLength: 10 },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧", format: "#### ######", minLength: 10, maxLength: 11 },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦", format: "### ### ####", minLength: 10, maxLength: 10 },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺", format: "### ### ###", minLength: 9, maxLength: 9 },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪", format: "### #######", minLength: 10, maxLength: 11 },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷", format: "# ## ## ## ##", minLength: 9, maxLength: 9 },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹", format: "### ### ####", minLength: 9, maxLength: 10 },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸", format: "### ### ###", minLength: 9, maxLength: 9 },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹", format: "### ### ###", minLength: 9, maxLength: 9 },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱", format: "## ### ####", minLength: 9, maxLength: 9 },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪", format: "### ## ## ##", minLength: 9, maxLength: 9 },
  { code: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭", format: "## ### ## ##", minLength: 9, maxLength: 9 },
  { code: "AT", name: "Austria", dialCode: "+43", flag: "🇦🇹", format: "### #######", minLength: 10, maxLength: 11 },
  { code: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪", format: "## ### ## ##", minLength: 9, maxLength: 9 },
  { code: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴", format: "### ## ###", minLength: 8, maxLength: 8 },
  { code: "DK", name: "Denmark", dialCode: "+45", flag: "🇩🇰", format: "## ## ## ##", minLength: 8, maxLength: 8 },
  { code: "FI", name: "Finland", dialCode: "+358", flag: "🇫🇮", format: "## ### ####", minLength: 9, maxLength: 10 },
  { code: "IE", name: "Ireland", dialCode: "+353", flag: "🇮🇪", format: "## ### ####", minLength: 9, maxLength: 9 },
  { code: "PL", name: "Poland", dialCode: "+48", flag: "🇵🇱", format: "### ### ###", minLength: 9, maxLength: 9 },
  { code: "CZ", name: "Czech Republic", dialCode: "+420", flag: "🇨🇿", format: "### ### ###", minLength: 9, maxLength: 9 },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵", format: "## #### ####", minLength: 10, maxLength: 11 },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷", format: "## #### ####", minLength: 10, maxLength: 11 },
  { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳", format: "### #### ####", minLength: 11, maxLength: 11 },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳", format: "##### #####", minLength: 10, maxLength: 10 },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷", format: "## ##### ####", minLength: 11, maxLength: 11 },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽", format: "## #### ####", minLength: 10, maxLength: 10 },
  { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷", format: "## #### ####", minLength: 10, maxLength: 10 },
  { code: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱", format: "# #### ####", minLength: 9, maxLength: 9 },
  { code: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴", format: "### ### ####", minLength: 10, maxLength: 10 },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦", format: "## ### ####", minLength: 9, maxLength: 9 },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪", format: "## ### ####", minLength: 9, maxLength: 9 },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦", format: "## ### ####", minLength: 9, maxLength: 9 },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬", format: "#### ####", minLength: 8, maxLength: 8 },
  { code: "HK", name: "Hong Kong", dialCode: "+852", flag: "🇭🇰", format: "#### ####", minLength: 8, maxLength: 8 },
  { code: "NZ", name: "New Zealand", dialCode: "+64", flag: "🇳🇿", format: "## ### ####", minLength: 9, maxLength: 10 },
  { code: "IL", name: "Israel", dialCode: "+972", flag: "🇮🇱", format: "## ### ####", minLength: 9, maxLength: 9 },
  { code: "RU", name: "Russia", dialCode: "+7", flag: "🇷🇺", format: "### ### ## ##", minLength: 10, maxLength: 10 },
  { code: "TR", name: "Turkey", dialCode: "+90", flag: "🇹🇷", format: "### ### ####", minLength: 10, maxLength: 10 },
  { code: "PH", name: "Philippines", dialCode: "+63", flag: "🇵🇭", format: "### ### ####", minLength: 10, maxLength: 10 },
  { code: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭", format: "## ### ####", minLength: 9, maxLength: 9 },
  { code: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾", format: "## ### ####", minLength: 9, maxLength: 10 },
  { code: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩", format: "### #### ####", minLength: 10, maxLength: 12 },
  { code: "VN", name: "Vietnam", dialCode: "+84", flag: "🇻🇳", format: "### ### ####", minLength: 9, maxLength: 10 },
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬", format: "### ### ####", minLength: 10, maxLength: 10 },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬", format: "### ### ####", minLength: 10, maxLength: 10 },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪", format: "### ### ###", minLength: 9, maxLength: 9 },
  { code: "PK", name: "Pakistan", dialCode: "+92", flag: "🇵🇰", format: "### ### ####", minLength: 10, maxLength: 10 },
  { code: "BD", name: "Bangladesh", dialCode: "+880", flag: "🇧🇩", format: "#### ######", minLength: 10, maxLength: 10 },
];

// Format phone number based on country format pattern
const formatPhoneNumber = (value: string, format: string): string => {
  const digits = value.replace(/\D/g, '');
  let result = '';
  let digitIndex = 0;
  
  for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
    if (format[i] === '#') {
      result += digits[digitIndex];
      digitIndex++;
    } else {
      result += format[i];
    }
  }
  
  return result;
};

// Get raw digits from formatted phone number
const getDigits = (value: string): string => value.replace(/\D/g, '');

export function AddPhoneDialog({ open, onOpenChange, onAdd }: AddPhoneDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [touched, setTouched] = useState({ phone: false, label: false });

  const digits = useMemo(() => getDigits(phoneNumber), [phoneNumber]);
  
  const validation = useMemo(() => {
    const errors: { phone?: string; label?: string } = {};
    
    if (touched.phone) {
      if (!digits) {
        errors.phone = "Phone number is required";
      } else if (digits.length < selectedCountry.minLength) {
        errors.phone = `Phone number must be at least ${selectedCountry.minLength} digits`;
      } else if (digits.length > selectedCountry.maxLength) {
        errors.phone = `Phone number must be at most ${selectedCountry.maxLength} digits`;
      }
    }
    
    if (touched.label && !label.trim()) {
      errors.label = "Label is required";
    }
    
    return errors;
  }, [digits, label, selectedCountry, touched]);

  const isValid = useMemo(() => {
    return (
      digits.length >= selectedCountry.minLength &&
      digits.length <= selectedCountry.maxLength &&
      label.trim().length > 0
    );
  }, [digits, selectedCountry, label]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const newDigits = getDigits(input);
    
    // Limit to max length
    if (newDigits.length <= selectedCountry.maxLength) {
      const formatted = formatPhoneNumber(newDigits, selectedCountry.format);
      setPhoneNumber(formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ phone: true, label: true });
    
    if (!isValid) return;

    const fullNumber = `${selectedCountry.dialCode} ${phoneNumber.trim()}`;
    
    setLoading(true);
    try {
      await onAdd(fullNumber, label.trim(), selectedCountry.code);
      setPhoneNumber("");
      setLabel("");
      setSelectedCountry(countries[0]);
      setTouched({ phone: false, label: false });
      onOpenChange(false);
    } catch (error) {
      // Error handled in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Add Phone Number
          </DialogTitle>
          <DialogDescription>
            Add a new phone number to connect with WhatsApp Business API.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={countryOpen}
                      className="w-[120px] justify-between px-3"
                      disabled={loading}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="text-sm">{selectedCountry.dialCode}</span>
                      </span>
                      <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0 z-50 bg-popover pointer-events-auto" align="start">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandList className="max-h-[300px] overflow-y-auto">
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {countries.map((country) => (
                            <CommandItem
                              key={country.code}
                              value={`${country.name} ${country.dialCode}`}
                              onSelect={() => {
                                setSelectedCountry(country);
                                setCountryOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedCountry.code === country.code
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <span className="text-lg mr-2">{country.flag}</span>
                              <span className="flex-1">{country.name}</span>
                              <span className="text-muted-foreground text-sm">
                                {country.dialCode}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className="flex-1 space-y-1">
                  <Input
                    id="phone"
                    placeholder={selectedCountry.format.replace(/#/g, '0')}
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                    disabled={loading}
                    className={cn(
                      validation.phone && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                </div>
              </div>
              {validation.phone && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {validation.phone}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {digits.length}/{selectedCountry.minLength === selectedCountry.maxLength 
                  ? selectedCountry.minLength 
                  : `${selectedCountry.minLength}-${selectedCountry.maxLength}`} digits
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                placeholder="e.g., Business, Support, Sales"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, label: true }))}
                disabled={loading}
                className={cn(
                  validation.label && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {validation.label && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {validation.label}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !isValid}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Phone"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
