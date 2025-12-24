import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  Video, 
  BookOpen, 
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Send
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I connect my WhatsApp Business account?",
          a: "Navigate to Settings > Integrations > WhatsApp. Click 'Connect Account' and follow the prompts to link your WhatsApp Business API credentials. You'll need your Phone Number ID and Access Token from Meta Business Manager."
        },
        {
          q: "What are the differences between the plans?",
          a: "Our Starter plan is perfect for small businesses with up to 1,000 contacts. Professional unlocks advanced automation and AI features for growing teams. Enterprise offers unlimited everything with dedicated support and custom integrations."
        },
        {
          q: "How do I import my existing contacts?",
          a: "Go to Contacts > Import/Export and upload a CSV file with your contact data. We support columns for name, phone number, email, and custom tags. The system will automatically detect duplicates."
        }
      ]
    },
    {
      category: "Automation & Workflows",
      questions: [
        {
          q: "How do I create an automated workflow?",
          a: "Open the Automation tab and click 'Create Flow'. Drag and drop triggers, conditions, and actions from the sidebar. Connect them to build your workflow, then click 'Activate' to go live."
        },
        {
          q: "Can I schedule messages for specific times?",
          a: "Yes! When creating a campaign, select 'Schedule for later' and choose your preferred date and time. You can also set up recurring campaigns for weekly or monthly sends."
        },
        {
          q: "What triggers are available for automation?",
          a: "We support keyword triggers, time-based triggers, contact actions (new signup, tag added), webhook triggers, and integration triggers from connected apps like Shopify or Calendly."
        }
      ]
    },
    {
      category: "AI Agents",
      questions: [
        {
          q: "How do AI agents work?",
          a: "AI agents are powered by advanced language models trained on your business data. They can answer customer questions, qualify leads, book appointments, and escalate complex issues to human agents automatically."
        },
        {
          q: "Can I customize the AI agent's personality?",
          a: "Absolutely! In AI Agents settings, you can set the tone (formal, friendly, professional), add custom instructions, and define specific responses for common scenarios. You can also add your knowledge base for context."
        },
        {
          q: "What languages does the AI support?",
          a: "Our AI agents support 50+ languages including English, Spanish, Portuguese, French, German, Arabic, Hindi, and Chinese. The system auto-detects the customer's language and responds accordingly."
        }
      ]
    },
    {
      category: "Billing & Account",
      questions: [
        {
          q: "How do I upgrade my plan?",
          a: "Go to Billing > Change Plan and select your desired tier. The upgrade takes effect immediately, and you'll be charged a prorated amount for the remainder of your billing cycle."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans. All payments are securely processed through Stripe."
        },
        {
          q: "Can I get a refund?",
          a: "We offer a 14-day money-back guarantee for new subscriptions. For refund requests, contact our support team with your account details and reason for cancellation."
        }
      ]
    }
  ];

  const resources = [
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides for all features",
      icon: Video,
      link: "#",
      count: "45+ videos"
    },
    {
      title: "Documentation",
      description: "Comprehensive guides and API references",
      icon: BookOpen,
      link: "#",
      count: "200+ articles"
    },
    {
      title: "Webinars",
      description: "Live training sessions and Q&A",
      icon: FileText,
      link: "#",
      count: "Weekly"
    }
  ];

  const recentTickets = [
    {
      id: "TKT-001",
      subject: "Unable to send bulk messages",
      status: "resolved",
      created: "2 days ago",
      lastUpdate: "1 day ago"
    },
    {
      id: "TKT-002",
      subject: "Integration with Zapier not working",
      status: "in-progress",
      created: "5 days ago",
      lastUpdate: "3 hours ago"
    },
    {
      id: "TKT-003",
      subject: "Request for API documentation",
      status: "open",
      created: "1 week ago",
      lastUpdate: "2 days ago"
    }
  ];

  const handleSubmitTicket = () => {
    if (!ticketSubject || !ticketMessage) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Support ticket submitted successfully!");
    setTicketSubject("");
    setTicketMessage("");
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20"><CheckCircle className="h-3 w-3 mr-1" /> Resolved</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
      case "open":
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"><AlertCircle className="h-3 w-3 mr-1" /> Open</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Help & Support</h1>
          <p className="text-muted-foreground">
            Find answers, get help, and connect with our support team
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for help articles, FAQs, or topics..."
            className="pl-12 py-6 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Live Chat</h3>
                <p className="text-sm text-muted-foreground">Chat with us now</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Email Support</h3>
                <p className="text-sm text-muted-foreground">support@whatsflow.com</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Phone Support</h3>
                <p className="text-sm text-muted-foreground">+1 (800) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="faq">FAQs</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            {(searchQuery ? filteredFaqs : faqs).map((category, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, qIdx) => (
                      <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
            {searchQuery && filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                <Button variant="link" onClick={() => setSearchQuery("")}>Clear search</Button>
              </div>
            )}
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Submit Ticket */}
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Ticket</CardTitle>
                  <CardDescription>Can't find what you're looking for? Open a support ticket.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Subject</label>
                    <Input 
                      placeholder="Brief description of your issue"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Message</label>
                    <Textarea 
                      placeholder="Describe your issue in detail..."
                      rows={5}
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSubmitTicket} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Ticket
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Tickets */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Tickets</CardTitle>
                  <CardDescription>Track your support requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentTickets.map((ticket) => (
                    <div 
                      key={ticket.id} 
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                            {getStatusBadge(ticket.status)}
                          </div>
                          <p className="font-medium text-foreground truncate">{ticket.subject}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Created {ticket.created} • Updated {ticket.lastUpdate}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.map((resource, idx) => (
                <Card key={idx} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                      <resource.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                    <Badge variant="secondary">{resource.count}</Badge>
                    <Button variant="link" className="mt-4 w-full">
                      Explore <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline" className="justify-start h-auto py-3">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <p className="font-medium">Getting Started Guide</p>
                      <p className="text-xs text-muted-foreground">5 min read</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3">
                    <FileText className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <p className="font-medium">API Documentation</p>
                      <p className="text-xs text-muted-foreground">For developers</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3">
                    <Video className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <p className="font-medium">Video Tutorials</p>
                      <p className="text-xs text-muted-foreground">45+ videos</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <p className="font-medium">Community Forum</p>
                      <p className="text-xs text-muted-foreground">Join discussions</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default HelpSupport;
