import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { IncomingMail, OutgoingMail } from '@/types/mail';
import { Trash2, Archive, CheckCircle, Clock, AlertTriangle, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MailActionsProps {
  selectedMails: string[];
  allMails: (IncomingMail | OutgoingMail)[];
  onSelectionChange: (ids: string[]) => void;
  onBulkAction: (action: string, mailIds: string[], newValue?: string) => void;
  type: 'incoming' | 'outgoing';
}

export const MailActions: React.FC<MailActionsProps> = ({
  selectedMails,
  allMails,
  onSelectionChange,
  onBulkAction,
  type
}) => {
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [newStatus, setNewStatus] = useState<string>('');
  const { toast } = useToast();

  const trackingOptions = ['En attente', 'En cours', 'Traité', 'Archivé', 'Urgent'];
  
  const bulkActions = [
    ...(type === 'incoming' ? [
      { value: 'update-status', label: 'Changer le statut', icon: CheckCircle, requiresValue: true },
    ] : []),
    { value: 'archive', label: 'Archiver', icon: Archive, requiresValue: false },
    { value: 'delete', label: 'Supprimer', icon: Trash2, requiresValue: false, destructive: true }
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(allMails.map(mail => mail.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleBulkAction = () => {
    if (!selectedAction || selectedMails.length === 0) return;

    if (selectedAction === 'update-status' && !newStatus) {
      toast({
        title: "Statut requis",
        description: "Veuillez sélectionner un nouveau statut.",
        variant: "destructive"
      });
      return;
    }

    const actionLabel = bulkActions.find(a => a.value === selectedAction)?.label || selectedAction;
    
    onBulkAction(selectedAction, selectedMails, newStatus);
    
    toast({
      title: `Action appliquée`,
      description: `${actionLabel} appliqué à ${selectedMails.length} courrier(s).`,
    });

    setIsActionDialogOpen(false);
    setSelectedAction('');
    setNewStatus('');
    onSelectionChange([]);
  };

  const isAllSelected = allMails.length > 0 && selectedMails.length === allMails.length;
  const isIndeterminate = selectedMails.length > 0 && selectedMails.length < allMails.length;

  if (allMails.length === 0) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border animate-fade-in">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm font-medium">
            {selectedMails.length > 0 
              ? `${selectedMails.length} courrier(s) sélectionné(s)`
              : 'Tout sélectionner'
            }
          </span>
        </div>

        {selectedMails.length > 0 && (
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Actions groupées disponibles
            </span>
          </div>
        )}
      </div>

      {selectedMails.length > 0 && (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectionChange([])}
            className="hover:bg-muted transition-all duration-200"
          >
            Annuler
          </Button>

          <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-accent/20 transition-all duration-200"
              >
                <MoreHorizontal className="h-4 w-4 mr-2" />
                Actions
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <MoreHorizontal className="h-5 w-5 mr-2" />
                  Actions groupées
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Courriers sélectionnés</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedMails.length} courrier(s) sur {allMails.length}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Action à effectuer</label>
                  <Select value={selectedAction} onValueChange={setSelectedAction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une action" />
                    </SelectTrigger>
                    <SelectContent>
                      {bulkActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <SelectItem 
                            key={action.value} 
                            value={action.value}
                            className={action.destructive ? "text-destructive" : ""}
                          >
                            <div className="flex items-center">
                              <Icon className="h-4 w-4 mr-2" />
                              {action.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {selectedAction === 'update-status' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nouveau statut</label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {trackingOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedAction === 'delete' && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center space-x-2 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Attention</span>
                    </div>
                    <p className="text-sm text-destructive/80 mt-1">
                      Cette action est irréversible. Les courriers sélectionnés seront définitivement supprimés.
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsActionDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleBulkAction}
                    disabled={!selectedAction || (selectedAction === 'update-status' && !newStatus)}
                    variant={selectedAction === 'delete' ? 'destructive' : 'default'}
                    className={selectedAction !== 'delete' ? 
                      "bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300" : 
                      ""
                    }
                  >
                    Appliquer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};