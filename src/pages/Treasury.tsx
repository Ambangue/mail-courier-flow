import React from 'react';
import { Header } from '@/components/layout/header';
import { TreasuryDashboard } from '@/components/treasury/treasury-dashboard';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import type { 
  BankAccount, 
  BankOperation, 
  CashBox, 
  CashOperation 
} from '@/types/treasury';

const Treasury: React.FC = () => {
  const { toast } = useToast();

  // Default data
  const defaultBankAccounts: BankAccount[] = [
    {
      id: 'bank-1',
      name: 'Compte courant principal',
      accountNumber: 'FR76 1234 5678 9012 3456',
      balance: 45000,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'bank-2',
      name: 'Compte épargne',
      accountNumber: 'FR76 9876 5432 1098 7654',
      balance: 15000,
      lastUpdated: new Date().toISOString()
    }
  ];

  const defaultCashBoxes: CashBox[] = [
    {
      id: 'cash-1',
      name: 'Caisse principale',
      balance: 2500,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'cash-2',
      name: 'Caisse déplacements',
      balance: 800,
      lastUpdated: new Date().toISOString()
    }
  ];

  // State management
  const [bankAccounts, setBankAccounts] = useLocalStorage<BankAccount[]>('bank-accounts', defaultBankAccounts);
  const [bankOperations, setBankOperations] = useLocalStorage<BankOperation[]>('bank-operations', []);
  const [cashBoxes, setCashBoxes] = useLocalStorage<CashBox[]>('treasury-cash-boxes', defaultCashBoxes);
  const [cashOperations, setCashOperations] = useLocalStorage<CashOperation[]>('treasury-cash-operations', []);

  // Get next order number for operations
  const getNextBankOrderNumber = (accountId: string) => {
    const accountOperations = bankOperations.filter(op => op.accountId === accountId);
    return accountOperations.length > 0 
      ? Math.max(...accountOperations.map(op => op.orderNumber)) + 1 
      : 1;
  };

  const getNextCashOrderNumber = (cashBoxId: string) => {
    const cashBoxOperations = cashOperations.filter(op => op.cashBoxId === cashBoxId);
    return cashBoxOperations.length > 0 
      ? Math.max(...cashBoxOperations.map(op => op.orderNumber)) + 1 
      : 1;
  };

  // Handlers
  const handleAddBankOperation = (operationData: Omit<BankOperation, 'id' | 'orderNumber' | 'previousBalance' | 'newBalance' | 'submittedBy'>) => {
    const account = bankAccounts.find(acc => acc.id === operationData.accountId);
    if (!account) return;

    const orderNumber = getNextBankOrderNumber(operationData.accountId);
    const previousBalance = account.balance;
    
    // Calculate new balance based on operation type
    const isIncoming = ['virement_entrant', 'cheque_recu'].includes(operationData.type);
    const newBalance = isIncoming 
      ? previousBalance + operationData.amount
      : previousBalance - operationData.amount;

    const newOperation: BankOperation = {
      ...operationData,
      id: `bank-op-${Date.now()}`,
      orderNumber,
      previousBalance,
      newBalance,
      submittedBy: 'Utilisateur Actuel' // TODO: Replace with actual user
    };

    setBankOperations(prev => [...prev, newOperation]);

    // Update account balance
    setBankAccounts(prev => prev.map(acc => 
      acc.id === operationData.accountId 
        ? { ...acc, balance: newBalance, lastUpdated: new Date().toISOString() }
        : acc
    ));

    toast({
      title: "Opération bancaire enregistrée",
      description: `Opération de ${operationData.amount}€ ajoutée avec succès.`,
    });
  };

  const handleAddCashOperation = (operationData: Omit<CashOperation, 'id' | 'orderNumber' | 'previousBalance' | 'newBalance' | 'submittedBy'>) => {
    const cashBox = cashBoxes.find(cb => cb.id === operationData.cashBoxId);
    if (!cashBox) return;

    const orderNumber = getNextCashOrderNumber(operationData.cashBoxId);
    const previousBalance = cashBox.balance;
    
    // Calculate new balance based on operation type
    const isIncoming = ['alimentation_banque', 'remboursement'].includes(operationData.type);
    const newBalance = isIncoming 
      ? previousBalance + operationData.amount
      : previousBalance - operationData.amount;

    const newOperation: CashOperation = {
      ...operationData,
      id: `cash-op-${Date.now()}`,
      orderNumber,
      previousBalance,
      newBalance,
      submittedBy: 'Utilisateur Actuel' // TODO: Replace with actual user
    };

    setCashOperations(prev => [...prev, newOperation]);

    // Update cash box balance
    setCashBoxes(prev => prev.map(cb => 
      cb.id === operationData.cashBoxId 
        ? { ...cb, balance: newBalance, lastUpdated: new Date().toISOString() }
        : cb
    ));

    toast({
      title: "Opération de caisse enregistrée",
      description: `Opération de ${operationData.amount}€ ajoutée avec succès.`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <Header
        title="Gestion de Trésorerie"
        description="Suivi des opérations bancaires et de caisse avec historique détaillé"
      />

      <TreasuryDashboard
        bankAccounts={bankAccounts}
        bankOperations={bankOperations}
        cashBoxes={cashBoxes}
        cashOperations={cashOperations}
        onAddBankOperation={handleAddBankOperation}
        onAddCashOperation={handleAddCashOperation}
      />
    </div>
  );
};

export default Treasury;