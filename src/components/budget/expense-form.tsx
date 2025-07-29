import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Budget, Expense } from '@/types/budget';

const expenseSchema = z.object({
  budgetId: z.string().min(1, 'Sélectionnez un budget'),
  amount: z.number().min(0.01, 'Le montant doit être supérieur à 0'),
  description: z.string().min(1, 'Description requise'),
  date: z.date(),
  category: z.string().min(1, 'Catégorie requise'),
  paymentMethod: z.enum(['cash', 'bank', 'card']),
  receipt: z.string().optional()
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  budgets: Budget[];
  onSubmit: (expense: Omit<Expense, 'id' | 'status' | 'submittedBy'>) => void;
  onCancel: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  budgets,
  onSubmit,
  onCancel
}) => {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date(),
      paymentMethod: 'bank'
    }
  });

  const handleSubmit = (data: ExpenseFormData) => {
    onSubmit({
      budgetId: data.budgetId,
      amount: data.amount,
      description: data.description,
      date: format(data.date, 'yyyy-MM-dd'),
      category: data.category,
      paymentMethod: data.paymentMethod,
      receipt: data.receipt
    });
    form.reset();
  };

  const expenseCategories = [
    'Fournitures de bureau',
    'Frais de déplacement',
    'Repas d\'affaires',
    'Formation',
    'Télécommunications',
    'Maintenance',
    'Marketing',
    'Divers'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvelle Dépense</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budgetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un budget" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {budgets.map((budget) => (
                          <SelectItem key={budget.id} value={budget.id}>
                            {budget.name} ({(budget.allocatedAmount - budget.spentAmount).toLocaleString()} € restant)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description de la dépense..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode de paiement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Espèces</SelectItem>
                        <SelectItem value="bank">Virement</SelectItem>
                        <SelectItem value="card">Carte</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="receipt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Justificatif</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input placeholder="URL ou nom du fichier" {...field} />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit">
                Enregistrer la dépense
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};