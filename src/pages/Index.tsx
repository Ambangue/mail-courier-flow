import React from 'react';
import { Navigation } from '@/components/layout/navigation';
import { Header } from '@/components/layout/header';
import { ArgonCard, ArgonCardHeader, ArgonCardTitle, ArgonCardContent } from '@/components/ui/argon-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MailOpen, Mail, TrendingUp, Calendar, Users, FileText, ArrowRight, DollarSign, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const todayDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const quickStats = [
    {
      title: 'Courriers Arrivés',
      value: '1',
      subtitle: 'Ce mois',
      icon: MailOpen,
      color: 'text-argon-blue',
      link: '/incoming'
    },
    {
      title: 'Courriers Départ',
      value: '0',
      subtitle: 'Ce mois',
      icon: Mail,
      color: 'text-argon-purple',
      link: '/outgoing'
    },
    {
      title: 'En Attente',
      value: '1',
      subtitle: 'À traiter',
      icon: FileText,
      color: 'text-argon-warning',
      link: '/incoming'
    },
    {
      title: 'Traités',
      value: '0',
      subtitle: 'Ce mois',
      icon: TrendingUp,
      color: 'text-argon-success',
      link: '/stats'
    }
  ];

  const recentActivity = [
    {
      id: '2021-0001',
      type: 'incoming',
      sender: 'AAA',
      subject: 'DESCRIPTION',
      date: '02/06/2021',
      status: 'Maintenance Interne'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <Navigation />
      
      {/* Hero Section */}
      <ArgonCard variant="gradient" className="mb-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary-glow/5"></div>
        <ArgonCardContent className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-4">
                Système de Gestion Intégré
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                Gestion de courriers et budget avec design Argon UI
              </p>
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{todayDate}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/incoming">
                <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300 w-full">
                  <MailOpen className="h-4 w-4 mr-2" />
                  Courriers
                </Button>
              </Link>
              <Link to="/budget">
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-glow transition-all duration-300 w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Budget
                </Button>
              </Link>
              <Link to="/outgoing">
                <Button variant="outline" className="hover:bg-accent/20 transition-all duration-200 w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Envois
                </Button>
              </Link>
              <Link to="/stats">
                <Button variant="outline" className="hover:bg-accent/20 transition-all duration-200 w-full">
                  <PieChart className="h-4 w-4 mr-2" />
                  Analyses
                </Button>
              </Link>
            </div>
          </div>
        </ArgonCardContent>
      </ArgonCard>

      {/* Modules principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Module Courrier */}
        <ArgonCard variant="gradient" className="hover:shadow-argon hover:-translate-y-1 transition-all duration-300">
          <ArgonCardHeader>
            <ArgonCardTitle className="flex items-center">
              <MailOpen className="h-5 w-5 mr-2 text-primary" />
              Gestion de Courrier
            </ArgonCardTitle>
          </ArgonCardHeader>
          <ArgonCardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1</div>
                <div className="text-sm text-muted-foreground">Arrivés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">0</div>
                <div className="text-sm text-muted-foreground">Départs</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/incoming" className="flex-1">
                <Button variant="outline" className="w-full">
                  <MailOpen className="h-4 w-4 mr-2" />
                  Arrivés
                </Button>
              </Link>
              <Link to="/outgoing" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Départs
                </Button>
              </Link>
            </div>
          </ArgonCardContent>
        </ArgonCard>

        {/* Module Budget */}
        <ArgonCard variant="gradient" className="hover:shadow-argon hover:-translate-y-1 transition-all duration-300">
          <ArgonCardHeader>
            <ArgonCardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-purple-500" />
              Gestion Budgétaire
            </ArgonCardTitle>
          </ArgonCardHeader>
          <ArgonCardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">3</div>
                <div className="text-sm text-muted-foreground">Budgets actifs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">2</div>
                <div className="text-sm text-muted-foreground">Caisses</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/budget" className="flex-1">
                <Button variant="outline" className="w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Budget
                </Button>
              </Link>
              <Link to="/stats" className="flex-1">
                <Button variant="outline" className="w-full">
                  <PieChart className="h-4 w-4 mr-2" />
                  Rapports
                </Button>
              </Link>
            </div>
          </ArgonCardContent>
        </ArgonCard>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} to={stat.link}>
              <ArgonCard variant="gradient" className="hover:shadow-argon hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <ArgonCardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary-glow/10">
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-foreground mb-1">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                </ArgonCardContent>
              </ArgonCard>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <ArgonCard variant="gradient">
          <ArgonCardHeader>
            <ArgonCardTitle>Activité Récente</ArgonCardTitle>
          </ArgonCardHeader>
          <ArgonCardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-primary/10 to-primary-glow/10">
                        {item.type === 'incoming' ? (
                          <MailOpen className="h-4 w-4 text-argon-blue" />
                        ) : (
                          <Mail className="h-4 w-4 text-argon-purple" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.type === 'incoming' ? `De: ${item.sender}` : `À: ${item.sender}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {item.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune activité récente</p>
              </div>
            )}
          </ArgonCardContent>
        </ArgonCard>

        {/* Quick Actions */}
        <ArgonCard variant="gradient">
          <ArgonCardHeader>
            <ArgonCardTitle>Actions Rapides</ArgonCardTitle>
          </ArgonCardHeader>
          <ArgonCardContent>
            <div className="space-y-4">
              <Link to="/incoming">
                <Button variant="outline" className="w-full justify-start hover:bg-accent/20 transition-all duration-200">
                  <MailOpen className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Nouveau Courrier Arrivé</div>
                    <div className="text-xs text-muted-foreground">Enregistrer un courrier entrant</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/outgoing">
                <Button variant="outline" className="w-full justify-start hover:bg-accent/20 transition-all duration-200">
                  <Mail className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Nouveau Courrier Départ</div>
                    <div className="text-xs text-muted-foreground">Enregistrer un courrier sortant</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/budget">
                <Button variant="outline" className="w-full justify-start hover:bg-accent/20 transition-all duration-200">
                  <DollarSign className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Gestion Budget</div>
                    <div className="text-xs text-muted-foreground">Budgets et dépenses</div>
                  </div>
                </Button>
              </Link>
              
              <Link to="/stats">
                <Button variant="outline" className="w-full justify-start hover:bg-accent/20 transition-all duration-200">
                  <TrendingUp className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Voir les Statistiques</div>
                    <div className="text-xs text-muted-foreground">Analyses et rapports</div>
                  </div>
                </Button>
              </Link>
            </div>
          </ArgonCardContent>
        </ArgonCard>
      </div>
    </div>
  );
};

export default Index;
