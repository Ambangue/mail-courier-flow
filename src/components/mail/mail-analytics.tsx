import React from 'react';
import { IncomingMail, OutgoingMail } from '@/types/mail';
import { ArgonCard, ArgonCardHeader, ArgonCardTitle, ArgonCardContent } from '@/components/ui/argon-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, PieChart, BarChart, Activity } from 'lucide-react';

interface MailAnalyticsProps {
  incomingMails: IncomingMail[];
  outgoingMails: OutgoingMail[];
}

export const MailAnalytics: React.FC<MailAnalyticsProps> = ({ incomingMails, outgoingMails }) => {
  const totalMails = incomingMails.length + outgoingMails.length;
  
  // Analytics calculations
  const trackingStats = {
    'En attente': incomingMails.filter(m => m.tracking === 'En attente').length,
    'En cours': incomingMails.filter(m => m.tracking === 'En cours').length,
    'Traité': incomingMails.filter(m => m.tracking === 'Traité').length,
    'Archivé': incomingMails.filter(m => m.tracking === 'Archivé').length,
    'Urgent': incomingMails.filter(m => m.tracking === 'Urgent').length,
    'Maintenance Interne': incomingMails.filter(m => m.tracking === 'Maintenance Interne').length,
  };

  const documentTypeStats = {
    'Courrier': [...incomingMails, ...outgoingMails].filter(m => m.documentType === 'Courrier').length,
    'Facture': [...incomingMails, ...outgoingMails].filter(m => m.documentType === 'Facture').length,
    'Contrat': [...incomingMails, ...outgoingMails].filter(m => m.documentType === 'Contrat').length,
    'Rapport': [...incomingMails, ...outgoingMails].filter(m => m.documentType === 'Rapport').length,
    'Demande': [...incomingMails, ...outgoingMails].filter(m => m.documentType === 'Demande').length,
    'Réponse': [...incomingMails, ...outgoingMails].filter(m => m.documentType === 'Réponse').length,
  };

  // Monthly trend (simulated)
  const currentMonth = new Date().getMonth();
  const lastMonth = currentMonth - 1;
  
  const monthlyTrend = {
    incoming: { current: incomingMails.length, previous: Math.max(0, incomingMails.length - 1) },
    outgoing: { current: outgoingMails.length, previous: Math.max(0, outgoingMails.length - 1) }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-argon-success" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const percentage = ((current - previous) / previous) * 100;
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(0)}%`;
  };

  const getProgressColor = (value: number, max: number) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    if (percentage >= 75) return "bg-argon-success";
    if (percentage >= 50) return "bg-argon-warning";
    if (percentage >= 25) return "bg-argon-info";
    return "bg-muted";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Overview Stats */}
      <ArgonCard variant="gradient" className="lg:col-span-2 xl:col-span-1">
        <ArgonCardHeader>
          <ArgonCardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Vue d'ensemble
          </ArgonCardTitle>
        </ArgonCardHeader>
        <ArgonCardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-argon-blue/10 to-argon-blue/5 rounded-xl">
              <div className="text-2xl font-bold text-argon-blue mb-1">{incomingMails.length}</div>
              <div className="text-xs text-muted-foreground">Arrivés</div>
              <div className="flex items-center justify-center mt-2 text-xs">
                {getTrendIcon(monthlyTrend.incoming.current, monthlyTrend.incoming.previous)}
                <span className="ml-1">{getTrendPercentage(monthlyTrend.incoming.current, monthlyTrend.incoming.previous)}</span>
              </div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-argon-purple/10 to-argon-purple/5 rounded-xl">
              <div className="text-2xl font-bold text-argon-purple mb-1">{outgoingMails.length}</div>
              <div className="text-xs text-muted-foreground">Départ</div>
              <div className="flex items-center justify-center mt-2 text-xs">
                {getTrendIcon(monthlyTrend.outgoing.current, monthlyTrend.outgoing.previous)}
                <span className="ml-1">{getTrendPercentage(monthlyTrend.outgoing.current, monthlyTrend.outgoing.previous)}</span>
              </div>
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary-glow/5 rounded-xl">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-1">
              {totalMails}
            </div>
            <div className="text-sm text-muted-foreground">Total courriers</div>
          </div>
        </ArgonCardContent>
      </ArgonCard>

      {/* Tracking Status Distribution */}
      <ArgonCard variant="gradient">
        <ArgonCardHeader>
          <ArgonCardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Statuts de Suivi
          </ArgonCardTitle>
        </ArgonCardHeader>
        <ArgonCardContent className="space-y-3">
          {Object.entries(trackingStats).map(([status, count]) => {
            const percentage = incomingMails.length > 0 ? (count / incomingMails.length) * 100 : 0;
            return (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{status}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">{count}</span>
                    <Badge variant="outline" className="text-xs">
                      {percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
              </div>
            );
          })}
        </ArgonCardContent>
      </ArgonCard>

      {/* Document Types Distribution */}
      <ArgonCard variant="gradient">
        <ArgonCardHeader>
          <ArgonCardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2" />
            Types de Documents
          </ArgonCardTitle>
        </ArgonCardHeader>
        <ArgonCardContent className="space-y-3">
          {Object.entries(documentTypeStats)
            .filter(([, count]) => count > 0)
            .sort(([, a], [, b]) => b - a)
            .map(([type, count]) => {
              const percentage = totalMails > 0 ? (count / totalMails) * 100 : 0;
              return (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{type}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{count}</span>
                      <Badge variant="secondary" className="text-xs">
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                  />
                </div>
              );
            })}
          
          {Object.values(documentTypeStats).every(count => count === 0) && (
            <div className="text-center py-6 text-muted-foreground">
              <BarChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucun document à analyser</p>
            </div>
          )}
        </ArgonCardContent>
      </ArgonCard>

      {/* Performance Indicators */}
      {incomingMails.length > 0 && (
        <ArgonCard variant="glass" className="lg:col-span-2 xl:col-span-3">
          <ArgonCardHeader>
            <ArgonCardTitle>Indicateurs de Performance</ArgonCardTitle>
          </ArgonCardHeader>
          <ArgonCardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-argon-success/10 to-argon-success/5">
                <div className="text-2xl font-bold text-argon-success mb-2">
                  {trackingStats['Traité']}
                </div>
                <div className="text-sm font-medium mb-1">Courriers Traités</div>
                <Progress 
                  value={incomingMails.length > 0 ? (trackingStats['Traité'] / incomingMails.length) * 100 : 0} 
                  className="h-2"
                />
              </div>
              
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-argon-warning/10 to-argon-warning/5">
                <div className="text-2xl font-bold text-argon-warning mb-2">
                  {trackingStats['En cours']}
                </div>
                <div className="text-sm font-medium mb-1">En Cours de Traitement</div>
                <Progress 
                  value={incomingMails.length > 0 ? (trackingStats['En cours'] / incomingMails.length) * 100 : 0} 
                  className="h-2"
                />
              </div>
              
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5">
                <div className="text-2xl font-bold text-destructive mb-2">
                  {trackingStats['Urgent']}
                </div>
                <div className="text-sm font-medium mb-1">Urgents</div>
                <Progress 
                  value={incomingMails.length > 0 ? (trackingStats['Urgent'] / incomingMails.length) * 100 : 0} 
                  className="h-2"
                />
              </div>
            </div>
          </ArgonCardContent>
        </ArgonCard>
      )}
    </div>
  );
};