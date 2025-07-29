import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ValidationRequest, Expense, Budget } from '@/types/budget';
import { CheckCircle, XCircle, Clock, Eye, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ValidationPanelProps {
  validationRequests: ValidationRequest[];
  expenses: Expense[];
  budgets: Budget[];
  onValidate: (requestId: string, status: 'approved' | 'rejected', comments?: string) => void;
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({
  validationRequests,
  expenses,
  budgets,
  onValidate
}) => {
  const [selectedRequest, setSelectedRequest] = useState<ValidationRequest | null>(null);
  const [comments, setComments] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pendingRequests = validationRequests.filter(req => req.status === 'pending');
  const processedRequests = validationRequests.filter(req => req.status !== 'pending');

  const getExpenseDetails = (expenseId: string) => 
    expenses.find(exp => exp.id === expenseId);

  const getBudgetName = (budgetId: string) => 
    budgets.find(budget => budget.id === budgetId)?.name || 'Budget inconnu';

  const handleValidation = (requestId: string, status: 'approved' | 'rejected') => {
    onValidate(requestId, status, comments);
    setComments('');
    setIsDialogOpen(false);
    setSelectedRequest(null);
  };

  const openValidationDialog = (request: ValidationRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'approved':
        return <Badge variant="default">Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Demandes à valider</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {processedRequests.filter(req => req.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {processedRequests.filter(req => req.status === 'rejected').length}
            </div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Demandes en attente de validation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune demande en attente de validation
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Demandeur</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((request) => {
                  const expense = getExpenseDetails(request.expenseId);
                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        {format(new Date(request.submittedAt), 'dd/MM/yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell>{request.submittedBy}</TableCell>
                      <TableCell className="font-medium">
                        {request.amount.toLocaleString()} €
                      </TableCell>
                      <TableCell>{request.description}</TableCell>
                      <TableCell>
                        {expense ? getBudgetName(expense.budgetId) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openValidationDialog(request)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Examiner
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Processed Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des validations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date soumission</TableHead>
                <TableHead>Demandeur</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Validé par</TableHead>
                <TableHead>Date validation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedRequests
                .sort((a, b) => new Date(b.validatedAt || 0).getTime() - new Date(a.validatedAt || 0).getTime())
                .slice(0, 10)
                .map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      {format(new Date(request.submittedAt), 'dd/MM/yyyy', { locale: fr })}
                    </TableCell>
                    <TableCell>{request.submittedBy}</TableCell>
                    <TableCell>{request.amount.toLocaleString()} €</TableCell>
                    <TableCell>{request.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        {getStatusBadge(request.status)}
                      </div>
                    </TableCell>
                    <TableCell>{request.validatedBy || '-'}</TableCell>
                    <TableCell>
                      {request.validatedAt ? 
                        format(new Date(request.validatedAt), 'dd/MM/yyyy', { locale: fr }) : 
                        '-'
                      }
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Validation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Validation de dépense</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Demandeur</label>
                  <p className="font-medium">{selectedRequest.submittedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Montant</label>
                  <p className="font-medium text-lg">{selectedRequest.amount.toLocaleString()} €</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date de soumission</label>
                  <p>{format(new Date(selectedRequest.submittedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Budget concerné</label>
                  <p>{(() => {
                    const expense = getExpenseDetails(selectedRequest.expenseId);
                    return expense ? getBudgetName(expense.budgetId) : 'N/A';
                  })()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1 p-3 bg-muted rounded-md">{selectedRequest.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Commentaires de validation</label>
                <Textarea
                  placeholder="Ajouter des commentaires (optionnel)..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleValidation(selectedRequest.id, 'rejected')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
                <Button
                  onClick={() => handleValidation(selectedRequest.id, 'approved')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};