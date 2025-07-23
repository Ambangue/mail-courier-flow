import React, { useState, useMemo } from 'react';
import { IncomingMail as IncomingMailType, MailFilters } from '@/types/mail';
import { Navigation } from '@/components/layout/navigation';
import { Header } from '@/components/layout/header';
import { MailTable } from '@/components/mail/mail-table';
import { IncomingMailForm } from '@/components/mail/incoming-mail-form';
import { AdvancedFilters } from '@/components/mail/advanced-filters';
import { ExportDialog } from '@/components/mail/export-dialog';
import { MailActions } from '@/components/mail/mail-actions';
import { MailAnalytics } from '@/components/mail/mail-analytics';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { BarChart3, Download } from 'lucide-react';

const IncomingMail: React.FC = () => {
  const [mails, setMails] = useLocalStorage<IncomingMailType[]>('incoming-mails', [
    {
      id: '2021-0001',
      date: '2021-06-02',
      sender: 'AAA',
      subject: 'DESCRIPTION',
      documentType: 'Courrier',
      tracking: 'Maintenance Interne',
      outgoingMailId: '',
      link: ''
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingMail, setEditingMail] = useState<IncomingMailType | undefined>();
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  const [filters, setFilters] = useLocalStorage<MailFilters>('incoming-filters', {
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

    // Text search
    if (filters.search) {
      result = result.filter(mail =>
        mail.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        mail.sender.toLowerCase().includes(filters.search.toLowerCase()) ||
        mail.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
        mail.documentType.toLowerCase().includes(filters.search.toLowerCase()) ||
        mail.tracking.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Document type filter
    if (filters.documentType && filters.documentType !== 'Tous') {
      result = result.filter(mail => mail.documentType === filters.documentType);
    }

    // Date range filter
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

  const handleEdit = (mail: IncomingMailType) => {
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

  const handleSubmit = (mailData: IncomingMailType) => {
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

  const handleCancel = () => {
    setShowForm(false);
    setEditingMail(undefined);
  };

  const handleFiltersReset = () => {
    setFilters({
      search: '',
      documentType: 'Tous',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleBulkAction = (action: string, mailIds: string[], newValue?: string) => {
    switch (action) {
      case 'delete':
        setMails(prev => prev.filter(mail => !mailIds.includes(mail.id)));
        setSelectedMails([]);
        break;
      case 'update-status':
        if (newValue) {
          setMails(prev => prev.map(mail => 
            mailIds.includes(mail.id) ? { ...mail, tracking: newValue } : mail
          ));
        }
        break;
      case 'archive':
        setMails(prev => prev.map(mail => 
          mailIds.includes(mail.id) ? { ...mail, tracking: 'Archivé' } : mail
        ));
        break;
    }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-8">
        <Navigation />
        <IncomingMailForm
          mail={editingMail}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  if (showAnalytics) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-8">
        <Navigation />
        <Header
          title="Analytiques - Courriers Arrivés"
          description="Analyses détaillées des courriers entrants"
        />
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setShowAnalytics(false)}
            className="hover:bg-muted transition-all duration-200"
          >
            ← Retour à la liste
          </Button>
        </div>
        <MailAnalytics incomingMails={mails} outgoingMails={[]} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 space-y-6">
      <Navigation />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Courriers Arrivés
          </h1>
          <p className="text-muted-foreground">Gestion avancée des courriers entrants</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => setShowAnalytics(true)}
            className="hover:bg-accent/20 transition-all duration-200"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytiques
          </Button>
          
          <ExportDialog 
            mails={filteredMails} 
            type="incoming"
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
        onReset={handleFiltersReset}
        isOpen={filtersOpen}
        onToggle={() => setFiltersOpen(!filtersOpen)}
      />

      <MailActions
        selectedMails={selectedMails}
        allMails={filteredMails}
        onSelectionChange={setSelectedMails}
        onBulkAction={handleBulkAction}
        type="incoming"
      />

      <MailTable
        mails={filteredMails}
        type="incoming"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IncomingMail;