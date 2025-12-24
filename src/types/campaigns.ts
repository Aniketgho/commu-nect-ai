export type TemplateCategory = 'marketing' | 'utility' | 'authentication';
export type TemplateStatus = 'approved' | 'pending' | 'rejected';
export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';

export interface MessageTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  status: TemplateStatus;
  language: string;
  headerType: 'text' | 'image' | 'video' | 'document' | 'none';
  headerContent?: string;
  bodyText: string;
  footerText?: string;
  buttons?: TemplateButton[];
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateButton {
  type: 'quick_reply' | 'url' | 'phone';
  text: string;
  value?: string;
}

export interface AudienceSegment {
  id: string;
  name: string;
  description?: string;
  filters: SegmentFilter[];
  contactCount: number;
  createdAt: string;
}

export interface SegmentFilter {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: string | string[] | number;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  templateId: string;
  template?: MessageTemplate;
  audienceId: string;
  audience?: AudienceSegment;
  status: CampaignStatus;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  analytics: CampaignAnalytics;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignAnalytics {
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  clicked: number;
  failed: number;
}

// Mock data
export const mockTemplates: MessageTemplate[] = [
  {
    id: '1',
    name: 'Welcome Message',
    category: 'utility',
    status: 'approved',
    language: 'en',
    headerType: 'text',
    headerContent: 'Welcome to {{1}}!',
    bodyText: 'Hi {{2}}, thank you for joining us. We are excited to have you on board!',
    footerText: 'Reply STOP to unsubscribe',
    buttons: [{ type: 'quick_reply', text: 'Get Started' }],
    variables: ['company_name', 'customer_name'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Order Confirmation',
    category: 'utility',
    status: 'approved',
    language: 'en',
    headerType: 'none',
    bodyText: 'Your order #{{1}} has been confirmed! Expected delivery: {{2}}',
    variables: ['order_id', 'delivery_date'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: '3',
    name: 'Flash Sale',
    category: 'marketing',
    status: 'pending',
    language: 'en',
    headerType: 'image',
    headerContent: 'https://example.com/sale-banner.jpg',
    bodyText: '🔥 Flash Sale Alert! Get {{1}}% off on all products. Use code: {{2}}',
    buttons: [{ type: 'url', text: 'Shop Now', value: 'https://example.com/shop' }],
    variables: ['discount_percent', 'promo_code'],
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
];

export const mockSegments: AudienceSegment[] = [
  {
    id: '1',
    name: 'All Customers',
    description: 'All registered customers',
    filters: [],
    contactCount: 15420,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'High Value Customers',
    description: 'Customers with lifetime value > $500',
    filters: [{ field: 'lifetime_value', operator: 'greater_than', value: 500 }],
    contactCount: 2340,
    createdAt: '2024-01-05',
  },
  {
    id: '3',
    name: 'Inactive Users',
    description: 'Users who haven\'t engaged in 30 days',
    filters: [{ field: 'last_active_days', operator: 'greater_than', value: 30 }],
    contactCount: 890,
    createdAt: '2024-01-10',
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'New Year Sale Campaign',
    description: 'Promotional campaign for new year sale',
    templateId: '3',
    audienceId: '1',
    status: 'completed',
    scheduledAt: '2024-01-01T10:00:00Z',
    startedAt: '2024-01-01T10:00:00Z',
    completedAt: '2024-01-01T12:30:00Z',
    analytics: {
      sent: 15420,
      delivered: 14890,
      read: 8920,
      replied: 1240,
      clicked: 3450,
      failed: 530,
    },
    createdAt: '2023-12-28',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'VIP Customer Rewards',
    description: 'Exclusive rewards for high-value customers',
    templateId: '1',
    audienceId: '2',
    status: 'scheduled',
    scheduledAt: '2024-02-01T09:00:00Z',
    analytics: {
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0,
      clicked: 0,
      failed: 0,
    },
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
];
