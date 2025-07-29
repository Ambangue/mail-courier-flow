export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  description: string;
}

export interface Budget {
  id: string;
  name: string;
  departmentId: string;
  categoryId: string;
  allocatedAmount: number;
  spentAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'exceeded' | 'pending';
  type: 'department' | 'project';
}

export interface Expense {
  id: string;
  budgetId: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  paymentMethod: 'cash' | 'bank' | 'card';
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  validatedBy?: string;
  receipt?: string;
}

export interface CashBox {
  id: string;
  name: string;
  balance: number;
  lastUpdated: string;
}

export interface CashTransaction {
  id: string;
  cashBoxId: string;
  amount: number;
  type: 'in' | 'out';
  description: string;
  date: string;
  category: string;
  submittedBy: string;
}

export interface ValidationRequest {
  id: string;
  expenseId: string;
  amount: number;
  description: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  validatedBy?: string;
  validatedAt?: string;
  comments?: string;
}