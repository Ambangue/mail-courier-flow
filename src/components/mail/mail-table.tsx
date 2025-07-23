import React from 'react';
import { IncomingMail, OutgoingMail, MailType } from '@/types/mail';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArgonCard } from '@/components/ui/argon-card';
import { Edit, Trash2, ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MailTableProps {
  mails: (IncomingMail | OutgoingMail)[];
  type: MailType;
  onEdit: (mail: IncomingMail | OutgoingMail) => void;
  onDelete: (id: string) => void;
}

export const MailTable: React.FC<MailTableProps> = ({ mails, type, onEdit, onDelete }) => {
  const getDocumentTypeVariant = (docType: string) => {
    switch (docType.toLowerCase()) {
      case 'courrier':
        return 'default';
      case 'facture':
        return 'destructive';
      case 'contrat':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getTrackingVariant = (tracking: string) => {
    switch (tracking.toLowerCase()) {
      case 'traité':
        return 'default';
      case 'en cours':
        return 'secondary';
      case 'urgent':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (mails.length === 0) {
    return (
      <ArgonCard variant="glass" className="text-center py-12">
        <div className="flex flex-col items-center space-y-4">
          {type === 'incoming' ? (
            <ArrowLeft className="h-12 w-12 text-muted-foreground" />
          ) : (
            <ArrowRight className="h-12 w-12 text-muted-foreground" />
          )}
          <h3 className="text-lg font-semibold text-muted-foreground">
            Aucun {type === 'incoming' ? 'courrier arrivé' : 'courrier départ'} trouvé
          </h3>
          <p className="text-sm text-muted-foreground">
            Commencez par ajouter votre premier courrier
          </p>
        </div>
      </ArgonCard>
    );
  }

  return (
    <ArgonCard variant="gradient" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-4 px-4 font-semibold text-foreground">ID</th>
              <th className="text-left py-4 px-4 font-semibold text-foreground">Date</th>
              <th className="text-left py-4 px-4 font-semibold text-foreground">
                {type === 'incoming' ? 'Expéditeur' : 'Destinataire'}
              </th>
              <th className="text-left py-4 px-4 font-semibold text-foreground">Objet</th>
              <th className="text-left py-4 px-4 font-semibold text-foreground">Type</th>
              {type === 'incoming' && (
                <th className="text-left py-4 px-4 font-semibold text-foreground">Suivi</th>
              )}
              <th className="text-left py-4 px-4 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mails.map((mail) => (
              <tr
                key={mail.id}
                className="border-b border-border/30 hover:bg-accent/20 transition-colors duration-200"
              >
                <td className="py-4 px-4">
                  <span className="font-mono text-sm font-medium text-primary">
                    {mail.id}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-foreground">
                  {new Date(mail.date).toLocaleDateString('fr-FR')}
                </td>
                <td className="py-4 px-4 text-sm text-foreground">
                  {'sender' in mail ? mail.sender : mail.recipient}
                </td>
                <td className="py-4 px-4 text-sm text-foreground max-w-xs truncate">
                  {mail.subject}
                </td>
                <td className="py-4 px-4">
                  <Badge variant={getDocumentTypeVariant(mail.documentType)}>
                    {mail.documentType}
                  </Badge>
                </td>
                {type === 'incoming' && (
                  <td className="py-4 px-4">
                    <Badge variant={getTrackingVariant((mail as IncomingMail).tracking)}>
                      {(mail as IncomingMail).tracking}
                    </Badge>
                  </td>
                )}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(mail)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(mail.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {mail.link && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(mail.link, '_blank')}
                        className="hover:bg-accent/10 hover:text-accent-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ArgonCard>
  );
};