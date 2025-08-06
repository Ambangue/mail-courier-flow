export interface Client {
  id: string;
  code: string;
  name: string;
  type: 'individual' | 'company';
  contact: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  rccm?: string;
  niu?: string;
  status: 'active' | 'inactive' | 'prospect';
  creditLimit: number;
  paymentTerms: string;
  lastContact?: Date;
  totalRevenue: number;
}

export interface Opportunity {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  value: number;
  probability: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closing' | 'closed-won' | 'closed-lost';
  expectedCloseDate: Date;
  assignedTo: string;
  source: string;
  status: 'open' | 'won' | 'lost';
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  notes?: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  subject: string;
  description: string;
  clientId?: string;
  opportunityId?: string;
  assignedTo: string;
  status: 'planned' | 'completed' | 'cancelled';
  scheduledDate: Date;
  completedDate?: Date;
  duration?: number;
  outcome?: string;
}