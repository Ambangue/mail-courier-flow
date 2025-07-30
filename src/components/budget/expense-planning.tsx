import React, { useState } from 'react';
import { ArgonCard, ArgonCardHeader, ArgonCardTitle, ArgonCardContent } from '@/components/ui/argon-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Budget, Department, BudgetCategory } from '@/types/budget';

interface ExpensePlanning {
  id: string;
  name: string;
  budgetId: string;
  plannedAmount: number;
  category: string;
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
  startDate: string;
  endDate?: string;
  description?: string;
  status: 'active' | 'completed' | 'cancelled';
  actualSpent: number;
}

interface ExpensePlanningProps {
  budgets: Budget[];
  departments: Department[];
  categories: BudgetCategory[];
  expensePlans: ExpensePlanning[];
  onAddPlan: (plan: Omit<ExpensePlanning, 'id' | 'actualSpent' | 'status'>) => void;
}

export const ExpensePlanningComponent: React.FC<ExpensePlanningProps> = ({
  budgets,
  departments,
  categories,
  expensePlans,
  onAddPlan
}) => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    budgetId: '',
    plannedAmount: '',
    category: '',
    frequency: 'monthly' as const,
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.budgetId || !formData.plannedAmount) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    onAddPlan({
      name: formData.name,
      budgetId: formData.budgetId,
      plannedAmount: parseFloat(formData.plannedAmount),
      category: formData.category,
      frequency: formData.frequency,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      description: formData.description || undefined
    });

    setFormData({
      name: '',
      budgetId: '',
      plannedAmount: '',
      category: '',
      frequency: 'monthly',
      startDate: '',
      endDate: '',
      description: ''
    });
    setShowForm(false);
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      monthly: 'Mensuel',
      quarterly: 'Trimestriel',
      yearly: 'Annuel',
      'one-time': 'Ponctuel'
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  const getBudgetName = (budgetId: string) => {
    return budgets.find(b => b.id === budgetId)?.name || 'Budget inconnu';
  };

  const calculateProgress = (plan: ExpensePlanning) => {
    return Math.min((plan.actualSpent / plan.plannedAmount) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Planification des Dépenses</h2>
          <p className="text-muted-foreground">Planifiez et suivez vos dépenses prévisionnelles</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-primary to-primary-glow">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Planification
        </Button>
      </div>

      {showForm && (
        <ArgonCard variant="gradient">
          <ArgonCardHeader>
            <ArgonCardTitle>Nouvelle Planification de Dépense</ArgonCardTitle>
          </ArgonCardHeader>
          <ArgonCardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom de la planification</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Matériel informatique Q1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget associé</Label>
                  <Select 
                    value={formData.budgetId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, budgetId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgets.map(budget => (
                        <SelectItem key={budget.id} value={budget.id}>
                          {budget.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Montant planifié (€)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.plannedAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, plannedAmount: e.target.value }))}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Fréquence</Label>
                  <Select 
                    value={formData.frequency} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="quarterly">Trimestriel</SelectItem>
                      <SelectItem value="yearly">Annuel</SelectItem>
                      <SelectItem value="one-time">Ponctuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Date de début</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Date de fin (optionnel)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description détaillée de la planification..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Créer la Planification
                </Button>
              </div>
            </form>
          </ArgonCardContent>
        </ArgonCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {expensePlans.map((plan) => (
          <ArgonCard key={plan.id} variant="gradient" className="hover:shadow-argon transition-all duration-300">
            <ArgonCardHeader>
              <div className="flex justify-between items-start">
                <ArgonCardTitle className="text-lg">{plan.name}</ArgonCardTitle>
                <Badge variant={plan.status === 'active' ? 'default' : plan.status === 'completed' ? 'secondary' : 'destructive'}>
                  {plan.status === 'active' ? 'Actif' : plan.status === 'completed' ? 'Terminé' : 'Annulé'}
                </Badge>
              </div>
            </ArgonCardHeader>
            <ArgonCardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progression</span>
                    <span>{calculateProgress(plan).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress(plan)}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Planifié</div>
                    <div className="font-semibold">{plan.plannedAmount.toLocaleString('fr-FR')} €</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Dépensé</div>
                    <div className="font-semibold">{plan.actualSpent.toLocaleString('fr-FR')} €</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget:</span>
                    <span>{getBudgetName(plan.budgetId)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fréquence:</span>
                    <span>{getFrequencyLabel(plan.frequency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Début:</span>
                    <span>{new Date(plan.startDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                
                {plan.description && (
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                )}
              </div>
            </ArgonCardContent>
          </ArgonCard>
        ))}
      </div>
      
      {expensePlans.length === 0 && (
        <ArgonCard variant="gradient">
          <ArgonCardContent className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune planification</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par créer votre première planification de dépenses
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une planification
            </Button>
          </ArgonCardContent>
        </ArgonCard>
      )}
    </div>
  );
};