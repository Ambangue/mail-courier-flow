import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const expenseAdvanceSchema = z.object({
  employeeId: z.string().min(1, "ID employé requis"),
  employeeName: z.string().min(1, "Nom employé requis"),
  requestType: z.enum(['advance', 'reimbursement'], {
    required_error: "Type de demande requis",
  }),
  amount: z.number().min(0.01, "Montant doit être supérieur à 0"),
  purpose: z.string().min(1, "Objet requis"),
  expectedDate: z.date({
    required_error: "Date prévue requise",
  }),
  justification: z.string().min(10, "Justification d'au moins 10 caractères"),
  receipts: z.string().optional(),
});

type ExpenseAdvanceFormData = z.infer<typeof expenseAdvanceSchema>;

interface ExpenseAdvanceFormProps {
  onSubmit: (data: ExpenseAdvanceFormData) => void;
  onCancel: () => void;
}

export const ExpenseAdvanceForm = ({ onSubmit, onCancel }: ExpenseAdvanceFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<ExpenseAdvanceFormData>({
    resolver: zodResolver(expenseAdvanceSchema),
    defaultValues: {
      employeeId: "",
      employeeName: "",
      requestType: "advance",
      amount: 0,
      purpose: "",
      justification: "",
      receipts: "",
    },
  });

  const handleSubmit = (data: ExpenseAdvanceFormData) => {
    const formattedData = {
      ...data,
      expectedDate: data.expectedDate,
    };
    
    onSubmit(formattedData);
    toast({
      title: "Demande soumise",
      description: "Votre demande d'avance/remboursement a été enregistrée.",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Demande d'avance ou de remboursement
        </CardTitle>
        <CardDescription>
          Remplissez ce formulaire pour soumettre une demande d'avance sur frais ou de remboursement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Employé</FormLabel>
                    <FormControl>
                      <Input placeholder="EMP001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employeeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="requestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de demande</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="advance">Avance sur frais</SelectItem>
                        <SelectItem value="reimbursement">Remboursement</SelectItem>
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
                    <FormLabel>Montant (FCFA)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objet</FormLabel>
                  <FormControl>
                    <Input placeholder="Mission, formation, achat matériel..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date prévue</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
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
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="justification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Justification</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez en détail la justification de cette demande..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receipts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pièces justificatives (pour remboursement)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit">Soumettre la demande</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};