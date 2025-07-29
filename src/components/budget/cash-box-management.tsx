import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CashBox, CashTransaction } from '@/types/budget';
import { Wallet, Plus, Minus, History, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CashBoxManagementProps {
  cashBoxes: CashBox[];
  transactions: CashTransaction[];
  onAddTransaction: (transaction: Omit<CashTransaction, 'id' | 'date' | 'submittedBy'>) => void;
}

export const CashBoxManagement: React.FC<CashBoxManagementProps> = ({
  cashBoxes,
  transactions,
  onAddTransaction
}) => {
  const [selectedCashBox, setSelectedCashBox] = useState<string>('');
  const [transactionType, setTransactionType] = useState<'in' | 'out'>('out');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const transactionCategories = [
    'Petits achats',
    'Frais de déplacement',
    'Repas',
    'Fournitures',
    'Réapprovisionnement',
    'Remboursement',
    'Divers'
  ];

  const handleSubmit = () => {
    if (!selectedCashBox || !amount || !description || !category) return;

    onAddTransaction({
      cashBoxId: selectedCashBox,
      amount: parseFloat(amount),
      type: transactionType,
      description,
      category
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setIsDialogOpen(false);
  };

  const getCashBoxTransactions = (cashBoxId: string) => 
    transactions.filter(t => t.cashBoxId === cashBoxId);

  const getTotalIn = (cashBoxId: string) => 
    getCashBoxTransactions(cashBoxId)
      .filter(t => t.type === 'in')
      .reduce((sum, t) => sum + t.amount, 0);

  const getTotalOut = (cashBoxId: string) => 
    getCashBoxTransactions(cashBoxId)
      .filter(t => t.type === 'out')
      .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Cash Boxes Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cashBoxes.map((cashBox) => {
          const totalIn = getTotalIn(cashBox.id);
          const totalOut = getTotalOut(cashBox.id);
          const recentTransactions = getCashBoxTransactions(cashBox.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);

          return (
            <Card key={cashBox.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{cashBox.name}</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{cashBox.balance.toLocaleString()} €</div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span>{totalIn.toLocaleString()} €</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingDown className="h-3 w-3 text-red-500" />
                    <span>{totalOut.toLocaleString()} €</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <History className="h-4 w-4 mr-2" />
                        Voir l'historique
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Historique - {cashBox.name}</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-96 overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Montant</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Catégorie</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {recentTransactions.map((transaction) => (
                              <TableRow key={transaction.id}>
                                <TableCell>
                                  {format(new Date(transaction.date), 'dd/MM/yyyy HH:mm', { locale: fr })}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={transaction.type === 'in' ? 'default' : 'secondary'}>
                                    {transaction.type === 'in' ? 'Entrée' : 'Sortie'}
                                  </Badge>
                                </TableCell>
                                <TableCell className={transaction.type === 'in' ? 'text-green-600' : 'text-red-600'}>
                                  {transaction.type === 'in' ? '+' : '-'}{transaction.amount.toLocaleString()} €
                                </TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>{transaction.category}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Transaction */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Nouvelle Transaction</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une transaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouvelle Transaction de Caisse</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Caisse</label>
                    <Select value={selectedCashBox} onValueChange={setSelectedCashBox}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une caisse" />
                      </SelectTrigger>
                      <SelectContent>
                        {cashBoxes.map((cashBox) => (
                          <SelectItem key={cashBox.id} value={cashBox.id}>
                            {cashBox.name} ({cashBox.balance.toLocaleString()} €)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Type de transaction</label>
                    <Select value={transactionType} onValueChange={(value: 'in' | 'out') => setTransactionType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">
                          <div className="flex items-center space-x-2">
                            <Plus className="h-4 w-4 text-green-500" />
                            <span>Entrée d'argent</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="out">
                          <div className="flex items-center space-x-2">
                            <Minus className="h-4 w-4 text-red-500" />
                            <span>Sortie d'argent</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Montant (€)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Catégorie</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {transactionCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Description de la transaction..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSubmit}>
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Gérez les transactions de petite caisse pour les dépenses quotidiennes.
            Cliquez sur "Ajouter une transaction" pour enregistrer une nouvelle opération.
          </p>
        </CardContent>
      </Card>

      {/* Recent Transactions Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Caisse</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Catégorie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((transaction) => {
                  const cashBox = cashBoxes.find(cb => cb.id === transaction.cashBoxId);
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(new Date(transaction.date), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </TableCell>
                      <TableCell>{cashBox?.name}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === 'in' ? 'default' : 'secondary'}>
                          {transaction.type === 'in' ? 'Entrée' : 'Sortie'}
                        </Badge>
                      </TableCell>
                      <TableCell className={transaction.type === 'in' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'in' ? '+' : '-'}{transaction.amount.toLocaleString()} €
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};