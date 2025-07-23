export interface IncomingMail {
  id: string;
  date: string;
  sender: string;
  subject: string;
  documentType: string;
  tracking: string;
  outgoingMailId?: string;
  link?: string;
}

export interface OutgoingMail {
  id: string;
  date: string;
  recipient: string;
  subject: string;
  documentType: string;
  incomingMailId?: string;
  link?: string;
}

export type MailType = 'incoming' | 'outgoing';

export interface MailFilters {
  search: string;
  documentType: string;
  dateFrom: string;
  dateTo: string;
}