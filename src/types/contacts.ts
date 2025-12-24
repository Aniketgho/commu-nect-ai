export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  tags: string[];
  status: 'active' | 'inactive' | 'blocked';
  lastMessage?: string;
  lastMessageTime?: Date;
  createdAt: Date;
  customFields?: Record<string, string>;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  contactCount: number;
}

export interface WhatsAppConfig {
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  webhookVerifyToken: string;
  isConnected: boolean;
  connectedAt?: Date;
}

// Mock data
export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    phone: '+1234567890',
    email: 'john@example.com',
    tags: ['customer', 'vip'],
    status: 'active',
    lastMessage: 'Thanks for your help!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '+1987654321',
    email: 'sarah@example.com',
    tags: ['lead', 'newsletter'],
    status: 'active',
    lastMessage: 'I\'d like to know about pricing...',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
  },
  {
    id: '3',
    name: 'Mike Chen',
    phone: '+1555666777',
    tags: ['customer'],
    status: 'active',
    lastMessage: 'Order #12345 status?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
  },
  {
    id: '4',
    name: 'Emily Brown',
    phone: '+1444555666',
    email: 'emily@example.com',
    tags: ['vip', 'customer'],
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
  },
  {
    id: '5',
    name: 'David Wilson',
    phone: '+1333444555',
    tags: ['lead'],
    status: 'inactive',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
  },
];

export const mockTags: Tag[] = [
  { id: '1', name: 'customer', color: '#10B981', contactCount: 3 },
  { id: '2', name: 'lead', color: '#3B82F6', contactCount: 2 },
  { id: '3', name: 'vip', color: '#8B5CF6', contactCount: 2 },
  { id: '4', name: 'newsletter', color: '#F59E0B', contactCount: 1 },
  { id: '5', name: 'support', color: '#EF4444', contactCount: 0 },
];
