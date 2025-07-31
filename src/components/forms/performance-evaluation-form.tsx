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
import { CalendarIcon, Star } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const performanceEvaluationSchema = z.object({
  employeeId: z.string().min(1, "ID employé requis"),
  employeeName: z.string().min(1, "Nom employé requis"),
  evaluatorName: z.string().min(1, "Nom évaluateur requis"),
  evaluationPeriod: z.string().min(1, "Période d'évaluation requise"),
  objectives: z.string().min(10, "Objectifs d'au moins 10 caractères"),
  achievements: z.string().min(10, "Réalisations d'au moins 10 caractères"),
  strengths: z.string().min(10, "Points forts d'au moins 10 caractères"),
  areasForImprovement: z.string().min(10, "Axes d'amélioration d'au moins 10 caractères"),
  trainingNeeds: z.string().min(5, "Besoins de formation requis"),
  overallRating: z.number().min(1).max(5, "Note de 1 à 5"),
  comments: z.string().min(10, "Commentaires d'au moins 10 caractères"),
  nextReviewDate: z.date({
    required_error: "Date prochaine évaluation requise",
  }),
});

type PerformanceEvaluationFormData = z.infer<typeof performanceEvaluationSchema>;

interface PerformanceEvaluationFormProps {
  onSubmit: (data: PerformanceEvaluationFormData) => void;
  onCancel: () => void;
}

export const PerformanceEvaluationForm = ({ onSubmit, onCancel }: PerformanceEvaluationFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<PerformanceEvaluationFormData>({
    resolver: zodResolver(performanceEvaluationSchema),
    defaultValues: {
      employeeId: "",
      employeeName: "",
      evaluatorName: "",
      evaluationPeriod: "",
      objectives: "",
      achievements: "",
      strengths: "",
      areasForImprovement: "",
      trainingNeeds: "",
      overallRating: 3,
      comments: "",
    },
  });

  const handleSubmit = (data: PerformanceEvaluationFormData) => {
    const formattedData = {
      ...data,
      nextReviewDate: data.nextReviewDate,
    };
    
    onSubmit(formattedData);
    toast({
      title: "Évaluation enregistrée",
      description: "L'évaluation de performance a été sauvegardée avec succès.",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Fiche d'évaluation du personnel
        </CardTitle>
        <CardDescription>
          Évaluation annuelle de performance et fixation d'objectifs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <FormLabel>Nom de l'employé</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="evaluatorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'évaluateur</FormLabel>
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
              name="evaluationPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Période d'évaluation</FormLabel>
                  <FormControl>
                    <Input placeholder="Janvier 2024 - Décembre 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objectifs fixés</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les objectifs qui étaient fixés pour cette période..."
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
              name="achievements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Réalisations</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez les principales réalisations de l'employé..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="strengths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points forts</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Identifiez les points forts de l'employé..."
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
                name="areasForImprovement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Axes d'amélioration</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Identifiez les domaines à améliorer..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="trainingNeeds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Besoins de formation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Identifiez les besoins de formation et développement..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="overallRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note globale (1-5)</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une note" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 - Insuffisant</SelectItem>
                      <SelectItem value="2">2 - En dessous des attentes</SelectItem>
                      <SelectItem value="3">3 - Répond aux attentes</SelectItem>
                      <SelectItem value="4">4 - Dépasse les attentes</SelectItem>
                      <SelectItem value="5">5 - Exceptionnel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaires généraux</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Commentaires généraux sur la performance..."
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
              name="nextReviewDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date prochaine évaluation</FormLabel>
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

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer l'évaluation</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};