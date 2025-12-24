import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  MessageCircle, 
  Clock, 
  CheckCheck,
  User,
  Headphones,
  Loader2,
  Plus,
  X
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface Conversation {
  id: string;
  status: string;
  subject: string | null;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_type: string;
  sender_id: string | null;
  content: string;
  created_at: string;
}

const LiveChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
      
      // Auto-select first active conversation
      if (data && data.length > 0 && !activeConversation) {
        const activeConv = data.find(c => c.status === 'active') || data[0];
        setActiveConversation(activeConv);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages for active conversation
  const fetchMessages = async () => {
    if (!activeConversation) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', activeConversation.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages();
    }
  }, [activeConversation]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!activeConversation) return;

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${activeConversation.id}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages(prev => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversation]);

  const startNewConversation = async () => {
    if (!user) {
      toast.error("Please log in to start a chat");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert([{
          user_id: user.id,
          subject: 'New Support Chat',
          status: 'active'
        }] as any)
        .select()
        .single();

      if (error) throw error;

      // Add system message
      await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: data.id,
          sender_type: 'system',
          content: 'Welcome to live support! An agent will be with you shortly.'
        }] as any);

      setConversations(prev => [data, ...prev]);
      setActiveConversation(data);
      toast.success("Chat started!");
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error("Failed to start chat");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !user) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: activeConversation.id,
          sender_type: 'user',
          sender_id: user.id,
          content: newMessage.trim()
        }] as any);

      if (error) throw error;

      setNewMessage("");

      // Simulate agent response after 2 seconds
      setTimeout(async () => {
        await supabase
          .from('chat_messages')
          .insert([{
            conversation_id: activeConversation.id,
            sender_type: 'agent',
            content: getAutoResponse(newMessage)
          }] as any);
      }, 2000);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const getAutoResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes('help') || lowerMsg.includes('support')) {
      return "I'm here to help! Could you please describe your issue in more detail?";
    } else if (lowerMsg.includes('billing') || lowerMsg.includes('payment')) {
      return "For billing inquiries, I can help you review your account. What specific question do you have about your billing?";
    } else if (lowerMsg.includes('cancel')) {
      return "I understand you're considering cancellation. Before we proceed, may I ask what's prompting this decision? Perhaps we can address your concerns.";
    } else {
      return "Thank you for your message. Let me look into this for you. Is there anything specific you'd like me to focus on?";
    }
  };

  const closeConversation = async () => {
    if (!activeConversation) return;

    try {
      await supabase
        .from('chat_conversations')
        .update({ status: 'closed' } as any)
        .eq('id', activeConversation.id);

      setConversations(prev => 
        prev.map(c => c.id === activeConversation.id ? { ...c, status: 'closed' } : c)
      );
      setActiveConversation(prev => prev ? { ...prev, status: 'closed' } : null);
      toast.success("Chat closed");
    } catch (error) {
      console.error('Error closing conversation:', error);
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-500">Active</Badge>;
      case 'waiting':
        return <Badge className="bg-yellow-500/10 text-yellow-500">Waiting</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="max-w-md w-full text-center p-8">
            <MessageCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Live Chat Support</h2>
            <p className="text-muted-foreground mb-6">
              Please log in to access live chat support with our team.
            </p>
            <Button asChild>
              <a href="/login">Sign In</a>
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Live Chat</h1>
            <p className="text-muted-foreground">Get instant support from our team</p>
          </div>
          <Button onClick={startNewConversation}>
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-5rem)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full px-4 pb-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No conversations yet</p>
                    <Button variant="link" size="sm" onClick={startNewConversation}>
                      Start a chat
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setActiveConversation(conv)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          activeConversation?.id === conv.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground truncate">
                            {conv.subject || 'Support Chat'}
                          </span>
                          {getStatusBadge(conv.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(conv.updated_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-3 flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Headphones className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Support Agent</CardTitle>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            Online
                          </span>
                          <span>•</span>
                          <span>Avg. response: 2 min</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(activeConversation.status)}
                      {activeConversation.status === 'active' && (
                        <Button variant="ghost" size="sm" onClick={closeConversation}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              msg.sender_type === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                : msg.sender_type === 'system'
                                ? 'bg-muted text-muted-foreground text-center w-full max-w-full text-sm'
                                : 'bg-muted text-foreground rounded-bl-sm'
                            }`}
                          >
                            {msg.sender_type === 'agent' && (
                              <div className="flex items-center gap-2 mb-1">
                                <Headphones className="h-3 w-3" />
                                <span className="text-xs font-medium">Support Agent</span>
                              </div>
                            )}
                            <p className="text-sm">{msg.content}</p>
                            <div className={`flex items-center gap-1 mt-1 ${
                              msg.sender_type === 'user' ? 'justify-end' : 'justify-start'
                            }`}>
                              <Clock className="h-3 w-3 opacity-60" />
                              <span className="text-xs opacity-60">
                                {formatTime(msg.created_at)}
                              </span>
                              {msg.sender_type === 'user' && (
                                <CheckCheck className="h-3 w-3 opacity-60 ml-1" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                {activeConversation.status === 'active' ? (
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        disabled={isSending}
                      />
                      <Button onClick={sendMessage} disabled={isSending || !newMessage.trim()}>
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-t bg-muted/50">
                    <p className="text-center text-sm text-muted-foreground">
                      This conversation has been closed.{' '}
                      <Button variant="link" size="sm" onClick={startNewConversation}>
                        Start a new chat
                      </Button>
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Start a Conversation
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Click "New Chat" to connect with our support team
                  </p>
                  <Button onClick={startNewConversation}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LiveChat;
