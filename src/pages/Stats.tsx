import React from 'react';
import { Navigation } from '@/components/layout/navigation';
import { Header } from '@/components/layout/header';
import { MailAnalytics } from '@/components/mail/mail-analytics';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { IncomingMail, OutgoingMail } from '@/types/mail';

const Stats: React.FC = () => {
  const [incomingMails] = useLocalStorage<IncomingMail[]>('incoming-mails', [
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
  
  const [outgoingMails] = useLocalStorage<OutgoingMail[]>('outgoing-mails', []);

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <Navigation />
      <Header
        title="Statistiques"
        description="Analyses et rapports avancés de la gestion du courrier"
      />
      <MailAnalytics incomingMails={incomingMails} outgoingMails={outgoingMails} />
    </div>
  );
};

export default Stats;