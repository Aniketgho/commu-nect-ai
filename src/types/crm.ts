export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'email' | 'phone' | 'url';
  options?: string[];
  required: boolean;
  order: number;
}

export interface LeadStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  stageId: string;
  tags: string[];
  customFields: Record<string, any>;
  notes: LeadNote[];
  source?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const defaultStages: LeadStage[] = [
  { id: '1', name: 'New', color: '#3B82F6', order: 1 },
  { id: '2', name: 'Contacted', color: '#8B5CF6', order: 2 },
  { id: '3', name: 'Qualified', color: '#F59E0B', order: 3 },
  { id: '4', name: 'Proposal', color: '#EC4899', order: 4 },
  { id: '5', name: 'Negotiation', color: '#10B981', order: 5 },
  { id: '6', name: 'Won', color: '#22C55E', order: 6 },
  { id: '7', name: 'Lost', color: '#EF4444', order: 7 },
];

export const defaultTags: Tag[] = [
  { id: '1', name: 'Hot Lead', color: '#EF4444' },
  { id: '2', name: 'Enterprise', color: '#8B5CF6' },
  { id: '3', name: 'SMB', color: '#3B82F6' },
  { id: '4', name: 'Referral', color: '#10B981' },
  { id: '5', name: 'Inbound', color: '#F59E0B' },
];

export const defaultCustomFields: CustomField[] = [
  { id: '1', name: 'Industry', type: 'select', options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Other'], required: false, order: 1 },
  { id: '2', name: 'Company Size', type: 'select', options: ['1-10', '11-50', '51-200', '201-500', '500+'], required: false, order: 2 },
  { id: '3', name: 'Budget', type: 'number', required: false, order: 3 },
  { id: '4', name: 'Website', type: 'url', required: false, order: 4 },
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1 555-0123',
    company: 'TechCorp Inc',
    stageId: '1',
    tags: ['1', '2'],
    customFields: { Industry: 'Technology', 'Company Size': '51-200', Budget: 50000 },
    notes: [
      { id: '1', leadId: '1', content: 'Initial contact made via LinkedIn', createdAt: new Date('2024-01-15'), createdBy: 'Sales Rep' }
    ],
    source: 'LinkedIn',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@healthplus.com',
    phone: '+1 555-0456',
    company: 'HealthPlus',
    stageId: '3',
    tags: ['3', '4'],
    customFields: { Industry: 'Healthcare', 'Company Size': '11-50', Budget: 25000 },
    notes: [],
    source: 'Referral',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'mchen@financegroup.com',
    phone: '+1 555-0789',
    company: 'Finance Group LLC',
    stageId: '4',
    tags: ['1', '5'],
    customFields: { Industry: 'Finance', 'Company Size': '201-500', Budget: 100000 },
    notes: [
      { id: '2', leadId: '3', content: 'Sent proposal for enterprise plan', createdAt: new Date('2024-01-14'), createdBy: 'Account Exec' }
    ],
    source: 'Website',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@retailworld.com',
    phone: '+1 555-0321',
    company: 'Retail World',
    stageId: '2',
    tags: ['3'],
    customFields: { Industry: 'Retail', 'Company Size': '1-10' },
    notes: [],
    source: 'Cold Email',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-13'),
  },
];
