export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  type: 'sales' | 'purchase' | 'service' | 'employment' | 'rental' | 'partnership';
  clientId?: string;
  supplierId?: string;
  startDate: Date;
  endDate: Date;
  value: number;
  currency: string;
  status: 'draft' | 'active' | 'expired' | 'terminated' | 'renewed';
  renewalType: 'none' | 'automatic' | 'manual';
  renewalPeriod?: number;
  paymentTerms: string;
  description: string;
  terms: string;
  signedBy: string;
  signedDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContractMilestone {
  id: string;
  contractId: string;
  title: string;
  description: string;
  dueDate: Date;
  value: number;
  status: 'pending' | 'completed' | 'overdue';
  completedDate?: Date;
  invoiced: boolean;
}

export interface ContractAlert {
  id: string;
  contractId: string;
  contractTitle: string;
  alertType: 'expiry' | 'milestone' | 'payment' | 'renewal';
  message: string;
  dueDate: Date;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
  createdAt: Date;
}