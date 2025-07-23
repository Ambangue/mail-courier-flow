import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArgonCard, ArgonCardContent } from '@/components/ui/argon-card';
import { IncomingMail, OutgoingMail } from '@/types/mail';
import { Download, FileText, Table, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportDialogProps {
  mails: (IncomingMail | OutgoingMail)[];
  type: 'incoming' | 'outgoing';
  trigger?: React.ReactNode;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ mails, type, trigger }) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'txt'>('csv');
  const [fileName, setFileName] = useState(`courriers_${type}_${new Date().toISOString().split('T')[0]}`);
  const [includeFields, setIncludeFields] = useState({
    id: true,
    date: true,
    contact: true,
    subject: true,
    documentType: true,
    tracking: type === 'incoming',
    link: false
  });
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const fieldLabels = {
    id: 'ID Courrier',
    date: 'Date',
    contact: type === 'incoming' ? 'Expéditeur' : 'Destinataire',
    subject: 'Objet',
    documentType: 'Type de document',
    tracking: 'Suivi',
    link: 'Lien'
  };

  const exportFormats = [
    { value: 'csv', label: 'CSV (Excel)', icon: FileSpreadsheet },
    { value: 'json', label: 'JSON', icon: FileText },
    { value: 'txt', label: 'Texte', icon: FileText }
  ];

  const handleExport = () => {
    if (mails.length === 0) {
      toast({
        title: "Aucune donnée à exporter",
        description: "Il n'y a aucun courrier à exporter.",
        variant: "destructive"
      });
      return;
    }

    const selectedFields = Object.entries(includeFields)
      .filter(([, included]) => included)
      .map(([field]) => field);

    if (selectedFields.length === 0) {
      toast({
        title: "Aucun champ sélectionné",
        description: "Veuillez sélectionner au moins un champ à exporter.",
        variant: "destructive"
      });
      return;
    }

    let content = '';
    let mimeType = '';
    let fileExtension = '';

    switch (exportFormat) {
      case 'csv':
        content = generateCSV(mails, selectedFields);
        mimeType = 'text/csv;charset=utf-8;';
        fileExtension = '.csv';
        break;
      case 'json':
        content = generateJSON(mails, selectedFields);
        mimeType = 'application/json;charset=utf-8;';
        fileExtension = '.json';
        break;
      case 'txt':
        content = generateTXT(mails, selectedFields);
        mimeType = 'text/plain;charset=utf-8;';
        fileExtension = '.txt';
        break;
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName + fileExtension;
    link.click();
    URL.revokeObjectURL(link.href);

    toast({
      title: "Export réussi",
      description: `${mails.length} courrier(s) exporté(s) au format ${exportFormat.toUpperCase()}.`,
    });

    setIsOpen(false);
  };

  const generateCSV = (data: (IncomingMail | OutgoingMail)[], fields: string[]) => {
    const headers = fields.map(field => fieldLabels[field as keyof typeof fieldLabels]).join(',');
    const rows = data.map(mail => 
      fields.map(field => {
        let value = '';
        switch (field) {
          case 'contact':
            value = 'sender' in mail ? mail.sender : mail.recipient;
            break;
          case 'tracking':
            value = 'tracking' in mail ? mail.tracking : '';
            break;
          default:
            value = (mail as any)[field] || '';
        }
        // Escape CSV values
        return `"${value.toString().replace(/"/g, '""')}"`;
      }).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const generateJSON = (data: (IncomingMail | OutgoingMail)[], fields: string[]) => {
    const exportData = data.map(mail => {
      const filteredMail: any = {};
      fields.forEach(field => {
        switch (field) {
          case 'contact':
            filteredMail[field] = 'sender' in mail ? mail.sender : mail.recipient;
            break;
          case 'tracking':
            if ('tracking' in mail) {
              filteredMail[field] = mail.tracking;
            }
            break;
          default:
            filteredMail[field] = (mail as any)[field];
        }
      });
      return filteredMail;
    });
    return JSON.stringify(exportData, null, 2);
  };

  const generateTXT = (data: (IncomingMail | OutgoingMail)[], fields: string[]) => {
    let content = `EXPORT DE COURRIERS - ${type.toUpperCase()}\n`;
    content += `Date d'export: ${new Date().toLocaleString('fr-FR')}\n`;
    content += `Nombre de courriers: ${data.length}\n\n`;
    content += '='.repeat(50) + '\n\n';

    data.forEach((mail, index) => {
      content += `COURRIER #${index + 1}\n`;
      content += '-'.repeat(20) + '\n';
      fields.forEach(field => {
        const label = fieldLabels[field as keyof typeof fieldLabels];
        let value = '';
        switch (field) {
          case 'contact':
            value = 'sender' in mail ? mail.sender : mail.recipient;
            break;
          case 'tracking':
            value = 'tracking' in mail ? mail.tracking : '';
            break;
          default:
            value = (mail as any)[field] || '';
        }
        if (value) {
          content += `${label}: ${value}\n`;
        }
      });
      content += '\n';
    });

    return content;
  };

  const handleFieldToggle = (field: string, checked: boolean) => {
    setIncludeFields(prev => ({ ...prev, [field]: checked }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="hover:bg-accent/20 transition-all duration-200">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Exporter les données
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Format d'export</Label>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map((format) => {
                  const Icon = format.icon;
                  return (
                    <SelectItem key={format.value} value={format.value}>
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-2" />
                        {format.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* File Name */}
          <div className="space-y-2">
            <Label htmlFor="fileName" className="text-sm font-medium">Nom du fichier</Label>
            <Input
              id="fileName"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="nom_du_fichier"
            />
          </div>

          {/* Fields Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Champs à inclure</Label>
            <ArgonCard variant="glass">
              <ArgonCardContent className="p-4 space-y-3">
                {Object.entries(fieldLabels).map(([field, label]) => {
                  if (field === 'tracking' && type !== 'incoming') return null;
                  
                  return (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox
                        id={field}
                        checked={includeFields[field as keyof typeof includeFields]}
                        onCheckedChange={(checked) => handleFieldToggle(field, checked as boolean)}
                      />
                      <Label 
                        htmlFor={field} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {label}
                      </Label>
                    </div>
                  );
                })}
              </ArgonCardContent>
            </ArgonCard>
          </div>

          {/* Summary */}
          <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
            <p><strong>{mails.length}</strong> courrier(s) à exporter</p>
            <p><strong>{Object.values(includeFields).filter(Boolean).length}</strong> champ(s) sélectionné(s)</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleExport}
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};