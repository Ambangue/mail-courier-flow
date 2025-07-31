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
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const timesheetSchema = z.object({
  employeeId: z.string().min(1, "ID employé requis"),
  employeeName: z.string().min(1, "Nom employé requis"),
  date: z.date({
    required_error: "Date requise",
  }),
  clockIn: z.string().min(1, "Heure d'arrivée requise"),
  clockOut: z.string().min(1, "Heure de départ requise"),
  breakDuration: z.number().min(0, "Durée de pause doit être positive"),
  overtimeHours: z.number().min(0, "Heures supplémentaires doivent être positives"),
  status: z.enum(['present', 'absent', 'late'], {
    required_error: "Statut requis",
  }),
  absenceReason: z.string().optional(),
});

type TimesheetFormData = z.infer<typeof timesheetSchema>;

interface TimesheetFormProps {
  onSubmit: (data: TimesheetFormData) => void;
  onCancel: () => void;
}

export const TimesheetForm = ({ onSubmit, onCancel }: TimesheetFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<TimesheetFormData>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: {
      employeeId: "",
      employeeName: "",
      clockIn: "",
      clockOut: "",
      breakDuration: 0,
      overtimeHours: 0,
      status: "present",
      absenceReason: "",
    },
  });

  const watchStatus = form.watch("status");

  const handleSubmit = (data: TimesheetFormData) => {
    const formattedData = {
      ...data,
      date: data.date,
    };
    
    onSubmit(formattedData);
    toast({
      title: "Fiche de pointage enregistrée",
      description: "Les heures de travail ont été enregistrées avec succès.",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Fiche de présence et pointage
        </CardTitle>
        <CardDescription>
          Enregistrement des heures de travail, retards et absences
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
                        disabled={(date) => date > new Date()}
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="present">Présent</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">En retard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchStatus === "absent" && (
              <FormField
                control={form.control}
                name="absenceReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motif d'absence</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Raison de l'absence..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchStatus !== "absent" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clockIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure d'arrivée</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clockOut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure de départ</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="breakDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durée de pause (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="60"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="overtimeHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heures supplémentaires</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.5"
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
              </>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer le pointage</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};