import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(email);
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setIsSubmitted(true);
    toast.success("Reset link sent! Check your email.");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8 dark">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg group-hover:bg-primary/30 transition-colors" />
            <div className="relative bg-primary p-2 rounded-lg">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <span className="text-xl font-bold text-foreground">
            Whats<span className="gradient-text">Flow</span>
          </span>
        </Link>

        {isSubmitted ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
              <p className="text-muted-foreground mt-2">
                We've sent a password reset link to <span className="text-foreground font-medium">{email}</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Didn't receive the email? Check your spam folder or
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsSubmitted(false)}
              >
                Try another email
              </Button>
            </div>
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">Forgot password?</h1>
              <p className="text-muted-foreground mt-2">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={`w-full pl-11 pr-4 py-3 bg-muted rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 border ${error ? 'border-destructive' : 'border-border'}`}
                  />
                </div>
                {error && <p className="text-sm text-destructive mt-1">{error}</p>}
              </div>

              <Button variant="hero" className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>

            {/* Back to login */}
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;