import React from 'react';
import { Button } from '@/components/ui/button';
import { ArgonCard } from '@/components/ui/argon-card';
import { MailOpen, Mail, Home, BarChart3, DollarSign, Building, Users, Package, Target, Scroll, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'Accueil',
      description: 'Tableau de bord'
    },
    {
      href: '/incoming',
      icon: MailOpen,
      label: 'Courriers Arrivés',
      description: 'Gestion des courriers entrants'
    },
    {
      href: '/outgoing',
      icon: Mail,
      label: 'Courriers Départ',
      description: 'Gestion des courriers sortants'
    },
    {
      href: '/hr',
      icon: Users,
      label: 'Ressources Humaines',
      description: 'Gestion du personnel et de la paie'
    },
    {
      href: '/inventory',
      icon: Package,
      label: 'Stocks',
      description: 'Gestion des stocks et inventaire'
    },
    {
      href: '/crm',
      icon: Target,
      label: 'Commercial (CRM)',
      description: 'Clients et opportunités'
    },
    {
      href: '/contracts',
      icon: Scroll,
      label: 'Contrats',
      description: 'Gestion des contrats'
    },
    {
      href: '/treasury',
      icon: Building,
      label: 'Trésorerie',
      description: 'Opérations bancaires et caisse'
    },
    {
      href: '/budget',
      icon: DollarSign,
      label: 'Budget',
      description: 'Gestion financière'
    },
    {
      href: '/forms',
      icon: FileText,
      label: 'Formulaires',
      description: 'Formulaires business'
    },
    {
      href: '/stats',
      icon: BarChart3,
      label: 'Statistiques',
      description: 'Rapports et analyses'
    }
  ];

  return (
    <ArgonCard variant="glass" className="mb-8">
      <nav className="flex flex-wrap gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link key={item.href} to={item.href} className="flex-1 min-w-[200px]">
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-4 transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary to-primary-glow shadow-glow text-white' 
                    : 'hover:bg-accent/20 hover:shadow-card'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-primary'}`} />
                  <div className="text-left">
                    <div className={`font-semibold ${isActive ? 'text-white' : 'text-foreground'}`}>
                      {item.label}
                    </div>
                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>
    </ArgonCard>
  );
};