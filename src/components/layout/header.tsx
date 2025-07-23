import React from 'react';
import { Button } from '@/components/ui/button';
import { ArgonCard } from '@/components/ui/argon-card';
import { Mail, MailOpen, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
  description: string;
  onAddNew?: () => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  description, 
  onAddNew, 
  onSearch,
  searchPlaceholder = "Rechercher..." 
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <ArgonCard variant="gradient" className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-primary to-primary-glow shadow-glow">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 lg:min-w-[400px]">
          {onSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}
          
          {onAddNew && (
            <Button
              onClick={onAddNew}
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau
            </Button>
          )}
        </div>
      </div>
    </ArgonCard>
  );
};