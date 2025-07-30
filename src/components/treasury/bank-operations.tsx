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
import { Plus, ArrowDownLeft, ArrowUpRight, Building, CreditCard } from 'lucide-react';
import type { BankAccount, BankOperation } from '@/types/treasury';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BankOperationsProps {
  bankAccounts: BankAccount[];
  bankOperations: BankOperation[];
  onAddOperation: (operation: Omit<BankOperation, 'id' | 'orderNumber' | 'previousBalance' | 'newBalance' | 'submittedBy'>) => void;
}

export const BankOperations: React.FC<BankOperationsProps> = ({
  bankAccounts,
  bankOperations,
  onAddOperation
}) => {
  const [selectedAccount, setSelectedAccount] = useState('');
  const [operationType, setOperationType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAccount || !operationType || !amount || !description) {
      return;
    }

    onAddOperation({
      accountId: selectedAccount,
      date: new Date().toISOString(),
      type: operationType as BankOperation['type'],
      description,
      amount: parseFloat(amount),
      reference: reference || undefined
    });

    // Reset form
    setSelectedAccount('');
    setOperationType('');
    setAmount('');
    setDescription('');
    setReference('');
    setIsDialogOpen(false);
  };

  const getOperationIcon = (type: BankOperation['type']) => {
    switch (type) {
      case 'virement_entrant':
      case 'cheque_recu':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case 'retrait_caisse':
      case 'frais_bancaires':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-blue-600" />;
    }
  };

  const getOperationLabel = (type: BankOperation['type']) => {
    const labels = {
      'virement_entrant': 'Virement entrant',
      'cheque_recu': 'Chèque reçu',
      'retrait_caisse': 'Retrait pour caisse',
      'frais_bancaires': 'Frais bancaires',
      'autres': 'Autres'
    };
    return labels[type];
  };

  const getOperationVariant = (type: BankOperation['type']) => {
    switch (type) {
      case 'virement_entrant':
      case 'cheque_recu':
        return 'default';
      case 'retrait_caisse':
      case 'frais_bancaires':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getAccountOperations = (accountId: string) => {
    return bankOperations
      .filter(op => op.accountId === accountId)
      .sort((a, b) => b.orderNumber - a.orderNumber);
  };

  return (
    <div className="space-y-6">
      {/* Comptes bancaires */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bankAccounts.map((account) => (
          <Card key={account.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {account.name}
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {account.balance.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Compte: {account.accountNumber}
              </p>
              <p className="text-xs text-muted-foreground">
                Mis à jour: {format(new Date(account.lastUpdated), 'dd/MM/yyyy HH:mm', { locale: fr })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Nouvelle opération */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Opérations bancaires</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle opération
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Enregistrer une opération bancaire</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account">Compte bancaire</Label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un compte" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} - {account.accountNumber}
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
                        <SelectItem value="virement_entrant">Virement entrant</SelectItem>
                        <SelectItem value="cheque_recu">Chèque reçu</SelectItem>
                        <SelectItem value="retrait_caisse">Retrait pour caisse</SelectItem>
                        <SelectItem value="frais_bancaires">Frais bancaires</SelectItem>
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
            {bankAccounts.map((account) => {
              const operations = getAccountOperations(account.id);
              return (
                <div key={account.id} className="space-y-2">
                  <h4 className="font-semibold text-sm">{account.name}</h4>
                  {operations.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">N°</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
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
                            <TableCell>{operation.description}</TableCell>
                            <TableCell className="text-right font-mono">
                              {operation.previousBalance.toLocaleString('fr-FR', {
                                style: 'currency',
                                currency: 'EUR'
                              })}
                            </TableCell>
                            <TableCell className={`text-right font-mono ${
                              ['virement_entrant', 'cheque_recu'].includes(operation.type) 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {['virement_entrant', 'cheque_recu'].includes(operation.type) ? '+' : '-'}
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