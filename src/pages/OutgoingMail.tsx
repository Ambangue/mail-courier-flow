import React, { useState, useMemo } from 'react';
import { OutgoingMail as OutgoingMailType, MailFilters } from '@/types/mail';
import { Navigation } from '@/components/layout/navigation';
import { MailTable } from '@/components/mail/mail-table';
import { OutgoingMailForm } from '@/components/mail/outgoing-mail-form';
import { AdvancedFilters } from '@/components/mail/advanced-filters';
import { ExportDialog } from '@/components/mail/export-dialog';
import { MailActions } from '@/components/mail/mail-actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Download } from 'lucide-react';

const OutgoingMail: React.FC = () => {
  const [mails, setMails] = useLocalStorage<OutgoingMailType[]>('outgoing-mails', []);
  const [showForm, setShowForm] = useState(false);
  const [editingMail, setEditingMail] = useState<OutgoingMailType | undefined>();
  
  const [filters, setFilters] = useLocalStorage<MailFilters>('outgoing-filters', {
    search: '',
    documentType: 'Tous',
    dateFrom: '',
    dateTo: ''
  });
  
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedMails, setSelectedMails] = useState<string[]>([]);
  const { toast } = useToast();

  const filteredMails = useMemo(() => {
    let result = mails;

    if (filters.search) {
      result = result.filter(mail =>
        mail.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        mail.recipient.toLowerCase().includes(filters.search.toLowerCase()) ||
        mail.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
        mail.documentType.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.documentType && filters.documentType !== 'Tous') {
      result = result.filter(mail => mail.documentType === filters.documentType);
    }

    if (filters.dateFrom) {
      result = result.filter(mail => new Date(mail.date) >= new Date(filters.dateFrom));
    }
    
    if (filters.dateTo) {
      result = result.filter(mail => new Date(mail.date) <= new Date(filters.dateTo));
    }

    return result;
  }, [mails, filters]);

  const handleAddNew = () => {
    setEditingMail(undefined);
    setShowForm(true);
  };

  const handleEdit = (mail: OutgoingMailType) => {
    setEditingMail(mail);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setMails(prev => prev.filter(mail => mail.id !== id));
    setSelectedMails(prev => prev.filter(mailId => mailId !== id));
    toast({
      title: "Courrier supprimé",
      description: "Le courrier a été supprimé avec succès.",
    });
  };

  const handleSubmit = (mailData: OutgoingMailType) => {
    if (editingMail) {
      setMails(prev => prev.map(mail => 
        mail.id === editingMail.id ? mailData : mail
      ));
      toast({
        title: "Courrier modifié",
        description: "Le courrier a été modifié avec succès.",
      });
    } else {
      setMails(prev => [...prev, mailData]);
      toast({
        title: "Courrier ajouté",
        description: "Le nouveau courrier a été ajouté avec succès.",
      });
    }
    setShowForm(false);
    setEditingMail(undefined);
  };

  const handleBulkAction = (action: string, mailIds: string[]) => {
    switch (action) {
      case 'delete':
        setMails(prev => prev.filter(mail => !mailIds.includes(mail.id)));
        setSelectedMails([]);
        break;
      case 'archive':
        // Archive logic for outgoing mails
        break;
    }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-8">
        <Navigation />
        <OutgoingMailForm
          mail={editingMail}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 space-y-6">
      <Navigation />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Courriers Départ
          </h1>
          <p className="text-muted-foreground">Gestion avancée des courriers sortants</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <ExportDialog 
            mails={filteredMails} 
            type="outgoing"
            trigger={
              <Button variant="outline" className="hover:bg-accent/20 transition-all duration-200">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            }
          />
          
          <Button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
          >
            Nouveau Courrier
          </Button>
        </div>
      </div>

      <AdvancedFilters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={() => setFilters({ search: '', documentType: 'Tous', dateFrom: '', dateTo: '' })}
        isOpen={filtersOpen}
        onToggle={() => setFiltersOpen(!filtersOpen)}
      />

      <MailActions
        selectedMails={selectedMails}
        allMails={filteredMails}
        onSelectionChange={setSelectedMails}
        onBulkAction={handleBulkAction}
        type="outgoing"
      />

      <MailTable
        mails={filteredMails}
        type="outgoing"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default OutgoingMail;