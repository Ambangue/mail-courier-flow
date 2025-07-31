import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const supplierClientSchema = z.object({
  type: z.enum(['supplier', 'client'], {
    required_error: "Type requis",
  }),
  companyName: z.string().min(1, "Nom de l'entreprise requis"),
  contactPerson: z.string().min(1, "Personne de contact requise"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Téléphone requis"),
  address: z.string().min(1, "Adresse requise"),
  rccm: z.string().optional(),
  niu: z.string().optional(),
  taxClearanceCertificate: z.string().optional(),
  bankName: z.string().min(1, "Nom de la banque requis"),
  accountNumber: z.string().min(1, "Numéro de compte requis"),
  iban: z.string().optional(),
  paymentTerms: z.string().min(1, "Conditions de paiement requises"),
  creditLimit: z.number().min(0, "Limite de crédit doit être positive").optional(),
  status: z.enum(['active', 'inactive', 'pending'], {
    required_error: "Statut requis",
  }),
});

type SupplierClientFormData = z.infer<typeof supplierClientSchema>;

interface SupplierClientFormProps {
  onSubmit: (data: SupplierClientFormData) => void;
  onCancel: () => void;
}

export const SupplierClientForm = ({ onSubmit, onCancel }: SupplierClientFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<SupplierClientFormData>({
    resolver: zodResolver(supplierClientSchema),
    defaultValues: {
      type: "supplier",
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      rccm: "",
      niu: "",
      taxClearanceCertificate: "",
      bankName: "",
      accountNumber: "",
      iban: "",
      paymentTerms: "",
      creditLimit: 0,
      status: "pending",
    },
  });

  const watchType = form.watch("type");

  const handleSubmit = (data: SupplierClientFormData) => {
    const formattedData = {
      ...data,
      bankDetails: {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        iban: data.iban,
      },
    };
    
    onSubmit(formattedData);
    toast({
      title: `${watchType === 'supplier' ? 'Fournisseur' : 'Client'} enregistré`,
      description: "Les informations ont été sauvegardées avec succès.",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Création/Mise à jour fournisseur/client
        </CardTitle>
        <CardDescription>
          Formulaire de collecte et validation des informations partenaires commerciaux
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="supplier">Fournisseur</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'entreprise</FormLabel>
                    <FormControl>
                      <Input placeholder="SARL Exemple" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personne de contact</FormLabel>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+242 XX XX XX XX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse complète</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adresse complète de l'entreprise..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="rccm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RCCM</FormLabel>
                    <FormControl>
                      <Input placeholder="CG-BZV-01-2024-XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="niu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIU</FormLabel>
                    <FormControl>
                      <Input placeholder="XXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxClearanceCertificate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attestation non redevance</FormLabel>
                    <FormControl>
                      <Input placeholder="Numéro attestation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations bancaires</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la banque</FormLabel>
                      <FormControl>
                        <Input placeholder="BGFIBANK Congo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de compte</FormLabel>
                      <FormControl>
                        <Input placeholder="XXXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="iban"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IBAN (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="CGXXXXXXXXXXXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conditions de paiement</FormLabel>
                    <FormControl>
                      <Input placeholder="30 jours net, comptant..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchType === 'client' && (
                <FormField
                  control={form.control}
                  name="creditLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite de crédit (FCFA)</FormLabel>
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
              )}
            </div>

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
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit">
                Enregistrer {watchType === 'supplier' ? 'le fournisseur' : 'le client'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};