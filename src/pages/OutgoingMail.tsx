import React, { useState, useMemo } from 'react';
import { OutgoingMail as OutgoingMailType } from '@/types/mail';
import { Navigation } from '@/components/layout/navigation';
import { Header } from '@/components/layout/header';
import { MailTable } from '@/components/mail/mail-table';
import { OutgoingMailForm } from '@/components/mail/outgoing-mail-form';
import { useToast } from '@/hooks/use-toast';

const OutgoingMail: React.FC = () => {
  const [mails, setMails] = useState<OutgoingMailType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMail, setEditingMail] = useState<OutgoingMailType | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const filteredMails = useMemo(() => {
    if (!searchQuery) return mails;
    
    return mails.filter(mail =>
      mail.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.documentType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [mails, searchQuery]);

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

  const handleCancel = () => {
    setShowForm(false);
    setEditingMail(undefined);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-8">
        <Navigation />
        <OutgoingMailForm
          mail={editingMail}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <Navigation />
      <Header
        title="Courriers Départ"
        description="Gestion des courriers sortants"
        onAddNew={handleAddNew}
        onSearch={setSearchQuery}
        searchPlaceholder="Rechercher dans les courriers départ..."
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