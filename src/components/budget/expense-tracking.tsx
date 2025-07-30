import React, { useState, useMemo } from 'react';
import { ArgonCard, ArgonCardHeader, ArgonCardTitle, ArgonCardContent } from '@/components/ui/argon-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Filter, Download, TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import type { Expense, Budget, Department } from '@/types/budget';

interface ExpenseTrackingProps {
  expenses: Expense[];
  budgets: Budget[];
  departments: Department[];
}

export const ExpenseTrackingComponent: React.FC<ExpenseTrackingProps> = ({
  expenses,
  budgets,
  departments
}) => {
  const [filters, setFilters] = useState({
    period: 'all',
    status: 'all',
    budgetId: 'all',
    search: ''
  });

  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtrer et trier les dépenses
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Filtre par recherche
    if (filters.search) {
      filtered = filtered.filter(expense => 
        expense.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        expense.submittedBy.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtre par statut
    if (filters.status !== 'all') {
      filtered = filtered.filter(expense => expense.status === filters.status);
    }

    // Filtre par budget
    if (filters.budgetId !== 'all') {
      filtered = filtered.filter(expense => expense.budgetId === filters.budgetId);
    }

    // Filtre par période
    if (filters.period !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (filters.period) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(expense => 
        new Date(expense.date) >= startDate
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [expenses, filters, sortBy, sortOrder]);

  // Statistiques
  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const approved = filteredExpenses.filter(e => e.status === 'approved').reduce((sum, expense) => sum + expense.amount, 0);
    const pending = filteredExpenses.filter(e => e.status === 'pending').reduce((sum, expense) => sum + expense.amount, 0);
    const rejected = filteredExpenses.filter(e => e.status === 'rejected').reduce((sum, expense) => sum + expense.amount, 0);

    return {
      total,
      approved,
      pending,
      rejected,
      count: filteredExpenses.length
    };
  }, [filteredExpenses]);

  const getBudgetName = (budgetId: string) => {
    return budgets.find(b => b.id === budgetId)?.name || 'Budget inconnu';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      approved: 'secondary',
      rejected: 'destructive'
    } as const;
    
    const labels = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté'
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Montant', 'Budget', 'Statut', 'Soumis par'];
    const csvContent = [
      headers.join(','),
      ...filteredExpenses.map(expense => [
        new Date(expense.date).toLocaleDateString('fr-FR'),
        `"${expense.description}"`,
        expense.amount,
        `"${getBudgetName(expense.budgetId)}"`,
        expense.status,
        `"${expense.submittedBy}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `depenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Suivi des Dépenses</h2>
          <p className="text-muted-foreground">Analysez et suivez toutes vos dépenses</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ArgonCard variant="gradient">
          <ArgonCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Dépenses</p>
                <p className="text-2xl font-bold">{stats.total.toLocaleString('fr-FR')} €</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </ArgonCardContent>
        </ArgonCard>

        <ArgonCard variant="gradient">
          <ArgonCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approuvées</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved.toLocaleString('fr-FR')} €</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </ArgonCardContent>
        </ArgonCard>

        <ArgonCard variant="gradient">
          <ArgonCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Attente</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending.toLocaleString('fr-FR')} €</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </ArgonCardContent>
        </ArgonCard>

        <ArgonCard variant="gradient">
          <ArgonCardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="text-2xl font-bold">{stats.count}</p>
              </div>
              <Filter className="h-8 w-8 text-purple-600" />
            </div>
          </ArgonCardContent>
        </ArgonCard>
      </div>

      {/* Filtres */}
      <ArgonCard variant="gradient">
        <ArgonCardHeader>
          <ArgonCardTitle>Filtres et Recherche</ArgonCardTitle>
        </ArgonCardHeader>
        <ArgonCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Input
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            
            <Select value={filters.period} onValueChange={(value) => setFilters(prev => ({ ...prev, period: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">7 derniers jours</SelectItem>
                <SelectItem value="month">30 derniers jours</SelectItem>
                <SelectItem value="quarter">3 derniers mois</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.budgetId} onValueChange={(value) => setFilters(prev => ({ ...prev, budgetId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les budgets</SelectItem>
                {budgets.map(budget => (
                  <SelectItem key={budget.id} value={budget.id}>
                    {budget.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date (récent)</SelectItem>
                <SelectItem value="date-asc">Date (ancien)</SelectItem>
                <SelectItem value="amount-desc">Montant (↓)</SelectItem>
                <SelectItem value="amount-asc">Montant (↑)</SelectItem>
                <SelectItem value="status-asc">Statut (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ArgonCardContent>
      </ArgonCard>

      {/* Tableau des dépenses */}
      <ArgonCard variant="gradient">
        <ArgonCardHeader>
          <ArgonCardTitle>Liste des Dépenses</ArgonCardTitle>
        </ArgonCardHeader>
        <ArgonCardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Soumis par</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {expense.description}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {expense.amount.toLocaleString('fr-FR')} €
                    </TableCell>
                    <TableCell>
                      {getBudgetName(expense.budgetId)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(expense.status)}
                    </TableCell>
                    <TableCell>
                      {expense.submittedBy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredExpenses.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune dépense trouvée</h3>
              <p className="text-muted-foreground">
                Ajustez vos filtres ou ajoutez des dépenses
              </p>
            </div>
          )}
        </ArgonCardContent>
      </ArgonCard>
    </div>
  );
};