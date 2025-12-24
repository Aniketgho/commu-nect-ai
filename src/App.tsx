import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TeamInbox from "./pages/TeamInbox";
import FlowBuilder from "./pages/FlowBuilder";
import AIAgents from "./pages/AIAgents";
import CampaignBuilder from "./pages/CampaignBuilder";
import CRMLeads from "./pages/CRMLeads";
import Contacts from "./pages/Contacts";
import Tags from "./pages/Tags";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import HelpSupport from "./pages/HelpSupport";
import LiveChat from "./pages/LiveChat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/inbox" element={<TeamInbox />} />
              <Route path="/dashboard/automation" element={<FlowBuilder />} />
              <Route path="/dashboard/ai-agents" element={<AIAgents />} />
              <Route path="/dashboard/campaigns" element={<CampaignBuilder />} />
              <Route path="/dashboard/crm" element={<CRMLeads />} />
              <Route path="/dashboard/contacts" element={<Contacts />} />
              <Route path="/dashboard/tags" element={<Tags />} />
              <Route path="/dashboard/billing" element={<Billing />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/help" element={<HelpSupport />} />
              <Route path="/live-chat" element={<LiveChat />} />
              <Route path="/admin" element={<AdminDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
