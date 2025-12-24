import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ContactSidebar from "@/components/inbox/ContactSidebar";
import ChatView from "@/components/inbox/ChatView";
import ContactProfile from "@/components/inbox/ContactProfile";
import { Button } from "@/components/ui/button";
import { PanelRightOpen, PanelRightClose } from "lucide-react";
import { useTrackAnalytics } from "@/hooks/useTrackAnalytics";
import { usePhoneNumbers } from "@/hooks/usePhoneNumbers";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: "online" | "offline" | "away";
  tags: string[];
  assignedTo?: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: "user" | "contact";
  status?: "sent" | "delivered" | "read";
}

// Mock data
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@email.com",
    location: "New York, USA",
    lastMessage: "Hi, I have a question about my order status...",
    timestamp: "2m ago",
    unread: 3,
    status: "online",
    tags: ["VIP", "Premium"],
    assignedTo: "John Doe",
  },
  {
    id: "2",
    name: "Michael Chen",
    phone: "+1 (555) 234-5678",
    email: "m.chen@company.com",
    lastMessage: "Thanks for the quick response!",
    timestamp: "15m ago",
    unread: 0,
    status: "offline",
    tags: ["New Lead"],
  },
  {
    id: "3",
    name: "Emma Williams",
    phone: "+1 (555) 345-6789",
    lastMessage: "Can you send me the product catalog?",
    timestamp: "1h ago",
    unread: 1,
    status: "away",
    tags: ["Inquiry"],
  },
  {
    id: "4",
    name: "James Rodriguez",
    phone: "+1 (555) 456-7890",
    lastMessage: "I'd like to place a bulk order",
    timestamp: "2h ago",
    unread: 0,
    status: "online",
    tags: ["B2B", "Hot Lead"],
    assignedTo: "Jane Smith",
  },
  {
    id: "5",
    name: "Olivia Brown",
    phone: "+1 (555) 567-8901",
    lastMessage: "Is there a discount for first-time buyers?",
    timestamp: "3h ago",
    unread: 2,
    status: "offline",
    tags: ["New Customer"],
  },
  {
    id: "6",
    name: "David Miller",
    phone: "+1 (555) 678-9012",
    lastMessage: "Order delivered. Thank you!",
    timestamp: "5h ago",
    unread: 0,
    status: "offline",
    tags: ["Repeat Customer"],
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hi, I have a question about my order status. Order #12345",
    timestamp: "10:30 AM",
    sender: "contact",
  },
  {
    id: "2",
    content:
      "Hello Sarah! Thank you for reaching out. Let me check your order status right away.",
    timestamp: "10:32 AM",
    sender: "user",
    status: "read",
  },
  {
    id: "3",
    content:
      "I can see your order #12345 is currently being prepared for shipping. It should be dispatched within the next 24 hours.",
    timestamp: "10:33 AM",
    sender: "user",
    status: "read",
  },
  {
    id: "4",
    content: "That's great! Will I receive a tracking number?",
    timestamp: "10:35 AM",
    sender: "contact",
  },
  {
    id: "5",
    content:
      "Absolutely! You'll receive an email and WhatsApp notification with the tracking details once your order is shipped.",
    timestamp: "10:36 AM",
    sender: "user",
    status: "delivered",
  },
  {
    id: "6",
    content: "Perfect, thank you so much for your help! 🙏",
    timestamp: "10:38 AM",
    sender: "contact",
  },
];

const mockAgents = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Mike Johnson" },
  { id: "4", name: "Emily Davis" },
];

const TeamInbox = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(mockContacts[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(true);
  
  const { trackMessageSent, trackMessageDelivered, trackMessageRead } = useTrackAnalytics();
  const { selectedPhoneId } = usePhoneNumbers();

  const handleSendMessage = async (content: string) => {
    const messageId = crypto.randomUUID();
    const newMessage: Message = {
      id: messageId,
      content,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      sender: "user",
      status: "sent",
    };
    setMessages([...messages, newMessage]);

    // Track the sent message
    await trackMessageSent({
      message_id: messageId,
      phone_number_id: selectedPhoneId || undefined,
    });

    // Simulate delivery after 1 second (in real app, this would come from webhook)
    setTimeout(async () => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "delivered" } : msg
        )
      );
      await trackMessageDelivered({
        message_id: messageId,
        phone_number_id: selectedPhoneId || undefined,
      });

      // Simulate read after 2 more seconds
      setTimeout(async () => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, status: "read" } : msg
          )
        );
        await trackMessageRead({
          message_id: messageId,
          phone_number_id: selectedPhoneId || undefined,
          response_time_seconds: 3, // Simulated response time
        });
      }, 2000);
    }, 1000);
  };

  const handleAssignAgent = (agentId: string) => {
    const agent = mockAgents.find((a) => a.id === agentId);
    if (agent && selectedContact) {
      setSelectedContact({
        ...selectedContact,
        assignedTo: agent.name,
      });
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  return (
    <>
      <Helmet>
        <title>Team Inbox | WhatsFlow</title>
        <meta
          name="description"
          content="Manage all your WhatsApp conversations in one place"
        />
      </Helmet>

      <DashboardLayout>
        <div className="h-[calc(100vh-7rem)] -m-6 flex relative">
          {/* Contact Sidebar */}
          <ContactSidebar
            contacts={mockContacts}
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Chat View */}
          <ChatView
            contact={selectedContact}
            messages={messages}
            agents={mockAgents}
            onSendMessage={handleSendMessage}
            onAssignAgent={handleAssignAgent}
          />

          {/* Contact Profile Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-6 top-4 z-10"
            onClick={() => setShowProfile(!showProfile)}
          >
            {showProfile ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </Button>

          {/* Contact Profile Sidebar */}
          {showProfile && (
            <ContactProfile
              contact={selectedContact}
              onClose={() => setShowProfile(false)}
            />
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default TeamInbox;
