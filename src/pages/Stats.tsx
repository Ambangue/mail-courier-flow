import React from 'react';
import { Navigation } from '@/components/layout/navigation';
import { Header } from '@/components/layout/header';
import { ArgonCard, ArgonCardHeader, ArgonCardTitle, ArgonCardContent } from '@/components/ui/argon-card';
import { Badge } from '@/components/ui/badge';
import { MailOpen, Mail, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Stats: React.FC = () => {
  const stats = [
    {
      title: 'Courriers Arrivés',
      value: '1',
      change: '+0%',
      icon: MailOpen,
      color: 'text-argon-blue'
    },
    {
      title: 'Courriers Départ',
      value: '0',
      change: '+0%',
      icon: Mail,
      color: 'text-argon-purple'
    },
    {
      title: 'En Traitement',
      value: '1',
      change: '+100%',
      icon: Clock,
      color: 'text-argon-warning'
    },
    {
      title: 'Traités',
      value: '0',
      change: '+0%',
      icon: CheckCircle,
      color: 'text-argon-success'
    }
  ];

  const trackingStats = [
    { label: 'En attente', count: 0, color: 'secondary' },
    { label: 'En cours', count: 0, color: 'default' },
    { label: 'Maintenance Interne', count: 1, color: 'outline' },
    { label: 'Traité', count: 0, color: 'default' },
    { label: 'Archivé', count: 0, color: 'secondary' },
    { label: 'Urgent', count: 0, color: 'destructive' }
  ];

  const documentTypeStats = [
    { label: 'Courrier', count: 1, color: 'default' },
    { label: 'Facture', count: 0, color: 'destructive' },
    { label: 'Contrat', count: 0, color: 'secondary' },
    { label: 'Rapport', count: 0, color: 'outline' },
    { label: 'Demande', count: 0, color: 'outline' },
    { label: 'Réponse', count: 0, color: 'outline' }
  ];

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <Navigation />
      <Header
        title="Statistiques"
        description="Analyses et rapports de la gestion du courrier"
      />

      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <ArgonCard key={index} variant="gradient" className="text-center">
              <ArgonCardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-gradient-to-r from-primary/10 to-primary-glow/10">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{stat.value}</h3>
                <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </Badge>
              </ArgonCardContent>
            </ArgonCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Statistiques par statut de suivi */}
        <ArgonCard variant="gradient">
          <ArgonCardHeader>
            <ArgonCardTitle>Répartition par Statut de Suivi</ArgonCardTitle>
          </ArgonCardHeader>
          <ArgonCardContent>
            <div className="space-y-4">
              {trackingStats.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary-glow"></div>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-foreground">{item.count}</span>
                    <Badge variant={item.color as any} className="text-xs">
                      {item.count > 0 ? `${((item.count / 1) * 100).toFixed(0)}%` : '0%'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ArgonCardContent>
        </ArgonCard>

        {/* Statistiques par type de document */}
        <ArgonCard variant="gradient">
          <ArgonCardHeader>
            <ArgonCardTitle>Répartition par Type de Document</ArgonCardTitle>
          </ArgonCardHeader>
          <ArgonCardContent>
            <div className="space-y-4">
              {documentTypeStats.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-argon-purple to-argon-pink"></div>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-foreground">{item.count}</span>
                    <Badge variant={item.color as any} className="text-xs">
                      {item.count > 0 ? `${((item.count / 1) * 100).toFixed(0)}%` : '0%'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ArgonCardContent>
        </ArgonCard>
      </div>

      {/* Alertes et notifications */}
      <ArgonCard variant="glass" className="mt-8">
        <ArgonCardHeader>
          <ArgonCardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-argon-warning" />
            <span>Alertes et Notifications</span>
          </ArgonCardTitle>
        </ArgonCardHeader>
        <ArgonCardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Aucune alerte active
            </h3>
            <p className="text-sm text-muted-foreground">
              Tous les courriers sont à jour et aucune action urgente n'est requise.
            </p>
          </div>
        </ArgonCardContent>
      </ArgonCard>
    </div>
  );
};

export default Stats;