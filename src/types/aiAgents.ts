import { Bot, Sparkles, MessageSquare, Users, Brain, Zap } from 'lucide-react';

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  type: 'sales' | 'support' | 'booking' | 'lead_qualification' | 'custom';
  status: 'active' | 'inactive' | 'draft';
  model: 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gpt-5' | 'gpt-5-mini';
  systemPrompt: string;
  welcomeMessage: string;
  fallbackMessage: string;
  enableHumanFallback: boolean;
  languages: string[];
  knowledgeBase: KnowledgeBaseItem[];
  conversations: number;
  successRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface KnowledgeBaseItem {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'url' | 'text';
  size?: string;
  status: 'processing' | 'ready' | 'failed';
  uploadedAt: Date;
}

export const agentTypeConfig = {
  sales: {
    icon: Sparkles,
    label: 'Sales Bot',
    description: 'Convert leads and close deals',
    color: 'emerald',
  },
  support: {
    icon: MessageSquare,
    label: 'Support Bot',
    description: 'Handle customer queries',
    color: 'blue',
  },
  booking: {
    icon: Users,
    label: 'Booking Assistant',
    description: 'Schedule appointments',
    color: 'purple',
  },
  lead_qualification: {
    icon: Zap,
    label: 'Lead Qualifier',
    description: 'Qualify and score leads',
    color: 'amber',
  },
  custom: {
    icon: Brain,
    label: 'Custom Agent',
    description: 'Build from scratch',
    color: 'rose',
  },
};

export const modelOptions = [
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Fast & balanced' },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', description: 'Most capable' },
  { value: 'gpt-5', label: 'GPT-5', description: 'OpenAI flagship' },
  { value: 'gpt-5-mini', label: 'GPT-5 Mini', description: 'Fast & efficient' },
];

export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ar', label: 'Arabic' },
  { value: 'zh', label: 'Chinese' },
];

// Mock data for demo
export const mockAgents: AIAgent[] = [
  {
    id: '1',
    name: 'Sales Assistant',
    description: 'Helps qualify leads and guide customers to purchase',
    type: 'sales',
    status: 'active',
    model: 'gemini-2.5-flash',
    systemPrompt: 'You are a friendly sales assistant...',
    welcomeMessage: 'Hi! 👋 I\'m here to help you find the perfect solution.',
    fallbackMessage: 'Let me connect you with a human agent.',
    enableHumanFallback: true,
    languages: ['en', 'es'],
    knowledgeBase: [
      { id: '1', name: 'Product Catalog.pdf', type: 'pdf', size: '2.4 MB', status: 'ready', uploadedAt: new Date() },
      { id: '2', name: 'Pricing Guide.pdf', type: 'pdf', size: '1.1 MB', status: 'ready', uploadedAt: new Date() },
    ],
    conversations: 1247,
    successRate: 78,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: '2',
    name: 'Customer Support',
    description: 'Handles customer queries and resolves issues',
    type: 'support',
    status: 'active',
    model: 'gemini-2.5-pro',
    systemPrompt: 'You are a helpful customer support agent...',
    welcomeMessage: 'Hello! How can I assist you today?',
    fallbackMessage: 'I\'ll transfer you to our support team.',
    enableHumanFallback: true,
    languages: ['en', 'fr', 'de'],
    knowledgeBase: [
      { id: '3', name: 'FAQ Document.pdf', type: 'pdf', size: '856 KB', status: 'ready', uploadedAt: new Date() },
    ],
    conversations: 3892,
    successRate: 92,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-12'),
  },
  {
    id: '3',
    name: 'Appointment Booker',
    description: 'Schedules meetings and appointments',
    type: 'booking',
    status: 'draft',
    model: 'gpt-5-mini',
    systemPrompt: 'You are a booking assistant...',
    welcomeMessage: 'Hi! I can help you schedule an appointment.',
    fallbackMessage: 'Please contact us directly to book.',
    enableHumanFallback: false,
    languages: ['en'],
    knowledgeBase: [],
    conversations: 0,
    successRate: 0,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
];
