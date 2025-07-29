import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Budget, Department, Expense, CashTransaction } from '@/types/budget';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Wallet, Target } from 'lucide-react';

interface BudgetDashboardProps {
  budgets: Budget[];
  departments: Department[];
  expenses: Expense[];
  cashTransactions: CashTransaction[];
}

export const BudgetDashboard: React.FC<BudgetDashboardProps> = ({
  budgets,
  departments,
  expenses,
  cashTransactions
}) => {
  // Calculate key metrics
  const totalBudget = budgets.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const totalRemaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Department budget analysis
  const departmentData = departments.map(dept => {
    const deptBudgets = budgets.filter(b => b.departmentId === dept.id);
    const allocated = deptBudgets.reduce((sum, b) => sum + b.allocatedAmount, 0);
    const spent = deptBudgets.reduce((sum, b) => sum + b.spentAmount, 0);
    return {
      name: dept.name,
      allocated,
      spent,
      remaining: allocated - spent,
      percentage: allocated > 0 ? (spent / allocated) * 100 : 0
    };
  });

  // Monthly expense trend
  const monthlyExpenses = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = Object.entries(monthlyExpenses).map(([month, amount]) => ({
    month,
    amount
  }));

  // Budget status distribution
  const statusData = [
    {
      name: 'Dans les limites',
      value: budgets.filter(b => b.spentAmount <= b.allocatedAmount * 0.8).length,
      color: '#22c55e'
    },
    {
      name: 'Attention (80%+)',
      value: budgets.filter(b => b.spentAmount > b.allocatedAmount * 0.8 && b.spentAmount <= b.allocatedAmount).length,
      color: '#f59e0b'
    },
    {
      name: 'Dépassé',
      value: budgets.filter(b => b.spentAmount > b.allocatedAmount).length,
      color: '#ef4444'
    }
  ];

  // Cash flow analysis
  const cashIn = cashTransactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
  const cashOut = cashTransactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = cashIn - cashOut;

  // Top spending categories
  const categorySpending = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categorySpending)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const chartConfig = {
    allocated: {
      label: "Alloué",
      color: "hsl(var(--primary))"
    },
    spent: {
      label: "Dépensé", 
      color: "hsl(var(--destructive))"
    },
    amount: {
      label: "Montant",
      color: "hsl(var(--primary))"
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBudget.toLocaleString()} €</div>
            <p className="text-xs text-muted-foreground">Allocation annuelle</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consommé</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpent.toLocaleString()} €</div>
            <p className="text-xs text-muted-foreground">{spentPercentage.toFixed(1)}% du budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponible</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRemaining.toLocaleString()} €</div>
            <p className="text-xs text-muted-foreground">Reste à dépenser</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flux de caisse</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netCashFlow >= 0 ? '+' : ''}{netCashFlow.toLocaleString()} €
            </div>
            <p className="text-xs text-muted-foreground">Flux net ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Budget Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Budget par Département</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="allocated" fill="var(--color-allocated)" name="Alloué" />
                  <Bar dataKey="spent" fill="var(--color-spent)" name="Dépensé" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Budget Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Statuts Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Expense Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Dépenses Mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="var(--color-amount)" 
                    strokeWidth={2}
                    name="Montant"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Spending Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 des Catégories de Dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCategories} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={120} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill="var(--color-amount)" name="Montant" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Warnings */}
      {budgets.some(b => b.spentAmount > b.allocatedAmount * 0.8) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Alertes Budgétaires</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {budgets
                .filter(b => b.spentAmount > b.allocatedAmount * 0.8)
                .map(budget => {
                  const dept = departments.find(d => d.id === budget.departmentId);
                  const percentage = (budget.spentAmount / budget.allocatedAmount) * 100;
                  return (
                    <div key={budget.id} className="flex items-center justify-between p-2 bg-white rounded">
                      <span className="font-medium">{budget.name} ({dept?.name})</span>
                      <span className={`font-bold ${percentage > 100 ? 'text-red-600' : 'text-yellow-600'}`}>
                        {percentage.toFixed(1)}% utilisé
                      </span>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};