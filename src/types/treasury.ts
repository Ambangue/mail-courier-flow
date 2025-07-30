export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  lastUpdated: string;
}

export interface BankOperation {
  id: string;
  accountId: string;
  orderNumber: number;
  date: string;
  type: 'virement_entrant' | 'cheque_recu' | 'retrait_caisse' | 'frais_bancaires' | 'autres';
  description: string;
  amount: number;
  previousBalance: number;
  newBalance: number;
  reference?: string;
  submittedBy: string;
}

export interface CashOperation {
  id: string;
  cashBoxId: string;
  orderNumber: number;
  date: string;
  type: 'alimentation_banque' | 'paiement_fournisseur' | 'frais_divers' | 'remboursement' | 'autres';
  description: string;
  amount: number;
  previousBalance: number;
  newBalance: number;
  paymentMethod: 'especes' | 'cheque';
  expenseCategory?: string;
  reference?: string;
  submittedBy: string;
}

export interface CashBox {
  id: string;
  name: string;
  balance: number;
  lastUpdated: string;
}

export interface TreasuryMovement {
  id: string;
  date: string;
  type: 'bank_to_cash' | 'cash_expense' | 'bank_income';
  fromAccount?: string;
  toAccount?: string;
  amount: number;
  description: string;
  reference?: string;
}