import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Wallet, ArrowLeftRight, ShoppingCart, Receipt } from 'lucide-react';
import type { CashBox, CashOperation } from '@/types/treasury';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CashOperationsProps {
  cashBoxes: CashBox[];
  cashOperations: CashOperation[];
  onAddOperation: (operation: Omit<CashOperation, 'id' | 'orderNumber' | 'previousBalance' | 'newBalance' | 'submittedBy'>) => void;
}

export const CashOperations: React.FC<CashOperationsProps> = ({
  cashBoxes,
  cashOperations,
  onAddOperation
}) => {
  const [selectedCashBox, setSelectedCashBox] = useState('');
  const [operationType, setOperationType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [reference, setReference] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCashBox || !operationType || !amount || !description || !paymentMethod) {
      return;
    }

    onAddOperation({
      cashBoxId: selectedCashBox,
      date: new Date().toISOString(),
      type: operationType as CashOperation['type'],
      description,
      amount: parseFloat(amount),
      paymentMethod: paymentMethod as CashOperation['paymentMethod'],
      expenseCategory: expenseCategory || undefined,
      reference: reference || undefined
    });

    // Reset form
    setSelectedCashBox('');
    setOperationType('');
    setAmount('');
    setDescription('');
    setPaymentMethod('');
    setExpenseCategory('');
    setReference('');
    setIsDialogOpen(false);
  };

  const getOperationIcon = (type: CashOperation['type']) => {
    switch (type) {
      case 'alimentation_banque':
        return <ArrowLeftRight className="h-4 w-4 text-blue-600" />;
      case 'paiement_fournisseur':
        return <ShoppingCart className="h-4 w-4 text-red-600" />;
      case 'frais_divers':
        return <Receipt className="h-4 w-4 text-orange-600" />;
      case 'remboursement':
        return <ArrowLeftRight className="h-4 w-4 text-green-600" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-600" />;
    }
  };

  const getOperationLabel = (type: CashOperation['type']) => {
    const labels = {
      'alimentation_banque': 'Alimentation depuis banque',
      'paiement_fournisseur': 'Paiement fournisseur',
      'frais_divers': 'Frais divers',
      'remboursement': 'Remboursement',
      'autres': 'Autres'
    };
    return labels[type];
  };

  const getOperationVariant = (type: CashOperation['type']) => {
    switch (type) {
      case 'alimentation_banque':
      case 'remboursement':
        return 'default';
      case 'paiement_fournisseur':
      case 'frais_divers':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getCashBoxOperations = (cashBoxId: string) => {
    return cashOperations
      .filter(op => op.cashBoxId === cashBoxId)
      .sort((a, b) => b.orderNumber - a.orderNumber);
  };

  const expenseCategories = [
    'Fournitures bureau',
    'Transport',
    'Repas/Restauration',
    'Maintenance',
    'Petit équipement',
    'Frais de mission',
    'Autres'
  ];

  return (
    <div className="space-y-6">
      {/* Caisses */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cashBoxes.map((cashBox) => (
          <Card key={cashBox.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {cashBox.name}
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cashBox.balance.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Mis à jour: {format(new Date(cashBox.lastUpdated), 'dd/MM/yyyy HH:mm', { locale: fr })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Nouvelle opération */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Opérations de caisse</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle opération
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Enregistrer une opération de caisse</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cashbox">Caisse</Label>
                    <Select value={selectedCashBox} onValueChange={setSelectedCashBox}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une caisse" />
                      </SelectTrigger>
                      <SelectContent>
                        {cashBoxes.map((cashBox) => (
                          <SelectItem key={cashBox.id} value={cashBox.id}>
                            {cashBox.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type d'opération</Label>
                    <Select value={operationType} onValueChange={setOperationType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type d'opération" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alimentation_banque">Alimentation depuis banque</SelectItem>
                        <SelectItem value="paiement_fournisseur">Paiement fournisseur</SelectItem>
                        <SelectItem value="frais_divers">Frais divers</SelectItem>
                        <SelectItem value="remboursement">Remboursement</SelectItem>
                        <SelectItem value="autres">Autres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Montant (€)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Mode de paiement</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Mode de paiement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="especes">Espèces</SelectItem>
                        <SelectItem value="cheque">Chèque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {['paiement_fournisseur', 'frais_divers'].includes(operationType) && (
                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie de dépense</Label>
                      <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description de l'opération"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reference">Référence (optionnel)</Label>
                    <Input
                      id="reference"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Numéro de référence"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">Enregistrer</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cashBoxes.map((cashBox) => {
              const operations = getCashBoxOperations(cashBox.id);
              return (
                <div key={cashBox.id} className="space-y-2">
                  <h4 className="font-semibold text-sm">{cashBox.name}</h4>
                  {operations.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">N°</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead className="text-right">Solde précédent</TableHead>
                          <TableHead className="text-right">Montant</TableHead>
                          <TableHead className="text-right">Nouveau solde</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {operations.slice(0, 5).map((operation) => (
                          <TableRow key={operation.id}>
                            <TableCell className="font-mono text-sm">
                              #{operation.orderNumber}
                            </TableCell>
                            <TableCell>
                              {format(new Date(operation.date), 'dd/MM/yyyy', { locale: fr })}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getOperationVariant(operation.type)} className="flex items-center gap-1">
                                {getOperationIcon(operation.type)}
                                {getOperationLabel(operation.type)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{operation.description}</p>
                                {operation.expenseCategory && (
                                  <p className="text-xs text-muted-foreground">{operation.expenseCategory}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {operation.paymentMethod === 'especes' ? 'Espèces' : 'Chèque'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {operation.previousBalance.toLocaleString('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              })}
                            </TableCell>
                            <TableCell className={`text-right font-mono ${
                              ['alimentation_banque', 'remboursement'].includes(operation.type) 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {['alimentation_banque', 'remboursement'].includes(operation.type) ? '+' : '-'}
                              {operation.amount.toLocaleString('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              })}
                            </TableCell>
                            <TableCell className="text-right font-mono font-semibold">
                              {operation.newBalance.toLocaleString('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune opération enregistrée</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};