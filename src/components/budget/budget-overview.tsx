import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Budget, Department, BudgetCategory } from '@/types/budget';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';

interface BudgetOverviewProps {
  budgets: Budget[];
  departments: Department[];
  categories: BudgetCategory[];
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  budgets,
  departments,
  categories
}) => {
  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocatedAmount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spentAmount, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const spentPercentage = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  const exceededBudgets = budgets.filter(budget => budget.spentAmount > budget.allocatedAmount);
  const nearLimitBudgets = budgets.filter(budget => 
    budget.spentAmount / budget.allocatedAmount > 0.8 && 
    budget.spentAmount <= budget.allocatedAmount
  );

  const getDepartmentName = (departmentId: string) => 
    departments.find(d => d.id === departmentId)?.name || 'Unknown';

  const getCategoryName = (categoryId: string) => 
    categories.find(c => c.id === categoryId)?.name || 'Unknown';

  const getStatusColor = (budget: Budget) => {
    const percentage = budget.spentAmount / budget.allocatedAmount;
    if (percentage > 1) return 'destructive';
    if (percentage > 0.8) return 'secondary';
    return 'default';
  };

  const getStatusIcon = (budget: Budget) => {
    const percentage = budget.spentAmount / budget.allocatedAmount;
    if (percentage > 1) return <AlertTriangle className="h-4 w-4" />;
    if (percentage > 0.8) return <TrendingUp className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAllocated.toLocaleString()} €</div>
            <p className="text-xs text-muted-foreground">Alloué pour cette période</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépensé</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpent.toLocaleString()} €</div>
            <p className="text-xs text-muted-foreground">{spentPercentage.toFixed(1)}% du budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restant</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRemaining.toLocaleString()} €</div>
            <p className="text-xs text-muted-foreground">Disponible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exceededBudgets.length + nearLimitBudgets.length}</div>
            <p className="text-xs text-muted-foreground">Budgets à surveiller</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progression Globale du Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Consommation budgétaire</span>
              <span>{spentPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={spentPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{totalSpent.toLocaleString()} € dépensé</span>
              <span>{totalAllocated.toLocaleString()} € total</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Details */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des Budgets par Département</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgets.map((budget) => {
              const percentage = budget.allocatedAmount > 0 ? (budget.spentAmount / budget.allocatedAmount) * 100 : 0;
              
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(budget)}
                      <div>
                        <p className="font-medium">{budget.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {getDepartmentName(budget.departmentId)} - {getCategoryName(budget.categoryId)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(budget)}>
                        {percentage.toFixed(1)}%
                      </Badge>
                      <span className="text-sm font-medium">
                        {budget.spentAmount.toLocaleString()} € / {budget.allocatedAmount.toLocaleString()} €
                      </span>
                    </div>
                  </div>
                  <Progress value={Math.min(percentage, 100)} className="h-1" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {(exceededBudgets.length > 0 || nearLimitBudgets.length > 0) && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>Alertes Budgétaires</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exceededBudgets.map((budget) => (
                <div key={budget.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div>
                    <p className="font-medium text-destructive">{budget.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Budget dépassé de {(budget.spentAmount - budget.allocatedAmount).toLocaleString()} €
                    </p>
                  </div>
                  <Badge variant="destructive">Dépassé</Badge>
                </div>
              ))}
              
              {nearLimitBudgets.map((budget) => (
                <div key={budget.id} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                  <div>
                    <p className="font-medium">{budget.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Proche de la limite (80%+ utilisé)
                    </p>
                  </div>
                  <Badge variant="secondary">Attention</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};