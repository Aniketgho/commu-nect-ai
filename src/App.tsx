import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
import PhoneNumbers from "./pages/PhoneNumbers";
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
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/inbox" element={<ProtectedRoute><TeamInbox /></ProtectedRoute>} />
              <Route path="/dashboard/automation" element={<ProtectedRoute><FlowBuilder /></ProtectedRoute>} />
              <Route path="/dashboard/ai-agents" element={<ProtectedRoute><AIAgents /></ProtectedRoute>} />
              <Route path="/dashboard/campaigns" element={<ProtectedRoute><CampaignBuilder /></ProtectedRoute>} />
              <Route path="/dashboard/crm" element={<ProtectedRoute><CRMLeads /></ProtectedRoute>} />
              <Route path="/dashboard/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
              <Route path="/dashboard/tags" element={<ProtectedRoute><Tags /></ProtectedRoute>} />
              <Route path="/dashboard/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
              <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/dashboard/phone-numbers" element={<ProtectedRoute><PhoneNumbers /></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><HelpSupport /></ProtectedRoute>} />
              <Route path="/live-chat" element={<ProtectedRoute><LiveChat /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
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
