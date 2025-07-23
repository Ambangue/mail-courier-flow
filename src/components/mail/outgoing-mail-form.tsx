import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { OutgoingMail } from '@/types/mail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArgonCard, ArgonCardHeader, ArgonCardTitle, ArgonCardContent, ArgonCardFooter } from '@/components/ui/argon-card';
import { Save, X } from 'lucide-react';

const outgoingMailSchema = z.object({
  id: z.string().min(1, 'ID requis'),
  date: z.string().min(1, 'Date requise'),
  recipient: z.string().min(1, 'Destinataire requis'),
  subject: z.string().min(1, 'Objet requis'),
  documentType: z.string().min(1, 'Type de document requis'),
  incomingMailId: z.string().optional(),
  link: z.string().optional(),
});

interface OutgoingMailFormProps {
  mail?: OutgoingMail;
  onSubmit: (mail: OutgoingMail) => void;
  onCancel: () => void;
}

export const OutgoingMailForm: React.FC<OutgoingMailFormProps> = ({ mail, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<OutgoingMail>({
    resolver: zodResolver(outgoingMailSchema),
    defaultValues: mail || {
      id: '',
      date: new Date().toISOString().split('T')[0],
      recipient: '',
      subject: '',
      documentType: '',
      incomingMailId: '',
      link: '',
    }
  });

  const documentTypes = ['Courrier', 'Facture', 'Contrat', 'Rapport', 'Demande', 'Réponse'];

  return (
    <ArgonCard variant="gradient" className="max-w-2xl mx-auto">
      <ArgonCardHeader>
        <ArgonCardTitle>
          {mail ? 'Modifier' : 'Ajouter'} un courrier départ
        </ArgonCardTitle>
      </ArgonCardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <ArgonCardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id" className="text-sm font-medium">
                ID Courrier
              </Label>
              <Input
                id="id"
                {...register('id')}
                placeholder="Ex: 2025-0001"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              {errors.id && <p className="text-sm text-destructive">{errors.id.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-sm font-medium">
              Destinataire
            </Label>
            <Input
              id="recipient"
              {...register('recipient')}
              placeholder="Nom du destinataire"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
            {errors.recipient && <p className="text-sm text-destructive">{errors.recipient.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">
              Objet
            </Label>
            <Textarea
              id="subject"
              {...register('subject')}
              placeholder="Objet du courrier"
              rows={3}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
            {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentType" className="text-sm font-medium">
              Type de document
            </Label>
            <Select onValueChange={(value) => setValue('documentType', value)}>
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.documentType && (
              <p className="text-sm text-destructive">{errors.documentType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="link" className="text-sm font-medium">
              Lien (optionnel)
            </Label>
            <Input
              id="link"
              {...register('link')}
              placeholder="https://..."
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </ArgonCardContent>

        <ArgonCardFooter className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="hover:bg-muted transition-all duration-200"
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </ArgonCardFooter>
      </form>
    </ArgonCard>
  );
};