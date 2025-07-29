import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BudgetOverview } from '@/components/budget/budget-overview';
import { ExpenseForm } from '@/components/budget/expense-form';
import { CashBoxManagement } from '@/components/budget/cash-box-management';
import { ValidationPanel } from '@/components/budget/validation-panel';
import { BudgetDashboard } from '@/components/budget/budget-dashboard';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { 
  Budget as BudgetType, 
  Department, 
  BudgetCategory, 
  Expense, 
  CashBox, 
  CashTransaction, 
  ValidationRequest 
} from '@/types/budget';
import { useToast } from '@/hooks/use-toast';

const Budget: React.FC = () => {
  const { toast } = useToast();

  // Default data
  const defaultDepartments: Department[] = [
    { id: 'dept-1', name: 'Ressources Humaines', code: 'RH' },
    { id: 'dept-2', name: 'Informatique', code: 'IT' },
    { id: 'dept-3', name: 'Marketing', code: 'MKT' },
    { id: 'dept-4', name: 'Finance', code: 'FIN' },
    { id: 'dept-5', name: 'Opérations', code: 'OPS' }
  ];

  const defaultCategories: BudgetCategory[] = [
    { id: 'cat-1', name: 'Fonctionnement', description: 'Dépenses courantes' },
    { id: 'cat-2', name: 'Équipement', description: 'Matériel et équipements' },
    { id: 'cat-3', name: 'Formation', description: 'Formation du personnel' },
    { id: 'cat-4', name: 'Marketing', description: 'Communication et publicité' },
    { id: 'cat-5', name: 'Projets', description: 'Projets spéciaux' }
  ];

  const defaultBudgets: BudgetType[] = [
    {
      id: 'budget-1',
      name: 'Budget RH 2024',
      departmentId: 'dept-1',
      categoryId: 'cat-1',
      allocatedAmount: 50000,
      spentAmount: 32000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      type: 'department'
    },
    {
      id: 'budget-2',
      name: 'Équipement IT',
      departmentId: 'dept-2',
      categoryId: 'cat-2',
      allocatedAmount: 75000,
      spentAmount: 68000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      type: 'department'
    },
    {
      id: 'budget-3',
      name: 'Campagne Marketing Q1',
      departmentId: 'dept-3',
      categoryId: 'cat-4',
      allocatedAmount: 25000,
      spentAmount: 23500,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      status: 'exceeded',
      type: 'project'
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
  const [departments] = useLocalStorage<Department[]>('departments', defaultDepartments);
  const [categories] = useLocalStorage<BudgetCategory[]>('budget-categories', defaultCategories);
  const [budgets, setBudgets] = useLocalStorage<BudgetType[]>('budgets', defaultBudgets);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [cashBoxes, setCashBoxes] = useLocalStorage<CashBox[]>('cash-boxes', defaultCashBoxes);
  const [cashTransactions, setCashTransactions] = useLocalStorage<CashTransaction[]>('cash-transactions', []);
  const [validationRequests, setValidationRequests] = useLocalStorage<ValidationRequest[]>('validation-requests', []);

  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // Handlers
  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'status' | 'submittedBy'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `expense-${Date.now()}`,
      status: 'pending',
      submittedBy: 'Utilisateur Actuel' // TODO: Replace with actual user
    };

    setExpenses(prev => [...prev, newExpense]);

    // Create validation request
    const validationRequest: ValidationRequest = {
      id: `validation-${Date.now()}`,
      expenseId: newExpense.id,
      amount: newExpense.amount,
      description: newExpense.description,
      submittedBy: newExpense.submittedBy,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    setValidationRequests(prev => [...prev, validationRequest]);

    // Update budget spent amount
    setBudgets(prev => prev.map(budget => 
      budget.id === expenseData.budgetId 
        ? { ...budget, spentAmount: budget.spentAmount + expenseData.amount }
        : budget
    ));

    setShowExpenseForm(false);
    toast({
      title: "Dépense enregistrée",
      description: "Votre dépense a été soumise pour validation.",
    });
  };

  const handleAddCashTransaction = (transactionData: Omit<CashTransaction, 'id' | 'date' | 'submittedBy'>) => {
    const newTransaction: CashTransaction = {
      ...transactionData,
      id: `cash-${Date.now()}`,
      date: new Date().toISOString(),
      submittedBy: 'Utilisateur Actuel' // TODO: Replace with actual user
    };

    setCashTransactions(prev => [...prev, newTransaction]);

    // Update cash box balance
    setCashBoxes(prev => prev.map(cashBox => 
      cashBox.id === transactionData.cashBoxId 
        ? { 
            ...cashBox, 
            balance: transactionData.type === 'in' 
              ? cashBox.balance + transactionData.amount
              : cashBox.balance - transactionData.amount,
            lastUpdated: new Date().toISOString()
          }
        : cashBox
    ));

    toast({
      title: "Transaction enregistrée",
      description: `Transaction de ${transactionData.amount}€ ajoutée avec succès.`,
    });
  };

  const handleValidateRequest = (requestId: string, status: 'approved' | 'rejected', comments?: string) => {
    setValidationRequests(prev => prev.map(request => 
      request.id === requestId 
        ? {
            ...request,
            status,
            validatedBy: 'Manager', // TODO: Replace with actual user
            validatedAt: new Date().toISOString(),
            comments
          }
        : request
    ));

    // Update expense status
    const request = validationRequests.find(r => r.id === requestId);
    if (request) {
      setExpenses(prev => prev.map(expense => 
        expense.id === request.expenseId 
          ? { ...expense, status, validatedBy: 'Manager' }
          : expense
      ));

      // If rejected, remove amount from budget
      if (status === 'rejected') {
        setBudgets(prev => prev.map(budget => {
          const expense = expenses.find(e => e.id === request.expenseId);
          return expense && budget.id === expense.budgetId
            ? { ...budget, spentAmount: budget.spentAmount - expense.amount }
            : budget;
        }));
      }
    }

    toast({
      title: status === 'approved' ? "Dépense approuvée" : "Dépense rejetée",
      description: `La demande a été ${status === 'approved' ? 'approuvée' : 'rejetée'} avec succès.`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <Header
        title="Gestion Budgétaire"
        description="Pilotage financier complet : budgets, dépenses, validation et analyse"
      />

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="expenses">Dépenses</TabsTrigger>
          <TabsTrigger value="cashbox">Petite caisse</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <BudgetDashboard 
            budgets={budgets}
            departments={departments}
            expenses={expenses}
            cashTransactions={cashTransactions}
          />
        </TabsContent>

        <TabsContent value="overview">
          <BudgetOverview
            budgets={budgets}
            departments={departments}
            categories={categories}
          />
        </TabsContent>

        <TabsContent value="expenses">
          <div className="space-y-6">
            {!showExpenseForm ? (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowExpenseForm(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                >
                  Nouvelle dépense
                </button>
              </div>
            ) : (
              <ExpenseForm
                budgets={budgets.filter(b => b.status === 'active')}
                onSubmit={handleAddExpense}
                onCancel={() => setShowExpenseForm(false)}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="cashbox">
          <CashBoxManagement
            cashBoxes={cashBoxes}
            transactions={cashTransactions}
            onAddTransaction={handleAddCashTransaction}
          />
        </TabsContent>

        <TabsContent value="validation">
          <ValidationPanel
            validationRequests={validationRequests}
            expenses={expenses}
            budgets={budgets}
            onValidate={handleValidateRequest}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Budget;