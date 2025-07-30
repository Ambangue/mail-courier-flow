import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BankOperations } from './bank-operations';
import { CashOperations } from './cash-operations';
import { Building, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import type { BankAccount, BankOperation, CashBox, CashOperation } from '@/types/treasury';

interface TreasuryDashboardProps {
  bankAccounts: BankAccount[];
  bankOperations: BankOperation[];
  cashBoxes: CashBox[];
  cashOperations: CashOperation[];
  onAddBankOperation: (operation: Omit<BankOperation, 'id' | 'orderNumber' | 'previousBalance' | 'newBalance' | 'submittedBy'>) => void;
  onAddCashOperation: (operation: Omit<CashOperation, 'id' | 'orderNumber' | 'previousBalance' | 'newBalance' | 'submittedBy'>) => void;
}

export const TreasuryDashboard: React.FC<TreasuryDashboardProps> = ({
  bankAccounts,
  bankOperations,
  cashBoxes,
  cashOperations,
  onAddBankOperation,
  onAddCashOperation
}) => {
  const totalBankBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);
  const totalCashBalance = cashBoxes.reduce((sum, cashBox) => sum + cashBox.balance, 0);
  const totalBalance = totalBankBalance + totalCashBalance;

  const todayOperations = [
    ...bankOperations.filter(op => 
      new Date(op.date).toDateString() === new Date().toDateString()
    ),
    ...cashOperations.filter(op => 
      new Date(op.date).toDateString() === new Date().toDateString()
    )
  ].length;

  const weeklyIncome = bankOperations
    .filter(op => {
      const opDate = new Date(op.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return opDate >= weekAgo && ['virement_entrant', 'cheque_recu'].includes(op.type);
    })
    .reduce((sum, op) => sum + op.amount, 0);

  const weeklyExpenses = [
    ...bankOperations.filter(op => {
      const opDate = new Date(op.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return opDate >= weekAgo && ['retrait_caisse', 'frais_bancaires'].includes(op.type);
    }),
    ...cashOperations.filter(op => {
      const opDate = new Date(op.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return opDate >= weekAgo && ['paiement_fournisseur', 'frais_divers'].includes(op.type);
    })
  ].reduce((sum, op) => sum + op.amount, 0);

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Trésorerie totale
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBalance.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Banque + Caisse
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solde bancaire
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBankBalance.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {bankAccounts.length} compte(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solde caisse
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCashBalance.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {cashBoxes.length} caisse(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Opérations aujourd'hui
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayOperations}</div>
            <p className="text-xs text-muted-foreground">
              Opérations enregistrées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques hebdomadaires */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recettes cette semaine
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {weeklyIncome.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Virements et chèques reçus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dépenses cette semaine
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {weeklyExpenses.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Retraits et paiements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Opérations détaillées */}
      <Tabs defaultValue="bank" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bank">Opérations bancaires</TabsTrigger>
          <TabsTrigger value="cash">Opérations de caisse</TabsTrigger>
        </TabsList>

        <TabsContent value="bank">
          <BankOperations
            bankAccounts={bankAccounts}
            bankOperations={bankOperations}
            onAddOperation={onAddBankOperation}
          />
        </TabsContent>

        <TabsContent value="cash">
          <CashOperations
            cashBoxes={cashBoxes}
            cashOperations={cashOperations}
            onAddOperation={onAddCashOperation}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};