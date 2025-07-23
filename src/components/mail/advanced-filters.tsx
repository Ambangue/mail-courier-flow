import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArgonCard, ArgonCardHeader, ArgonCardTitle, ArgonCardContent } from '@/components/ui/argon-card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MailFilters } from '@/types/mail';
import { Filter, X, Calendar as CalendarIcon, Search, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AdvancedFiltersProps {
  filters: MailFilters;
  onFiltersChange: (filters: MailFilters) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  isOpen,
  onToggle
}) => {
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);

  const documentTypes = ['Tous', 'Courrier', 'Facture', 'Contrat', 'Rapport', 'Demande', 'Réponse'];
  
  const activeFiltersCount = [
    filters.search,
    filters.documentType !== 'Tous' ? filters.documentType : '',
    filters.dateFrom,
    filters.dateTo
  ].filter(Boolean).length;

  const handleFilterChange = (key: keyof MailFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateFromSelect = (date: Date | undefined) => {
    if (date) {
      handleFilterChange('dateFrom', format(date, 'yyyy-MM-dd'));
    }
    setDateFromOpen(false);
  };

  const handleDateToSelect = (date: Date | undefined) => {
    if (date) {
      handleFilterChange('dateTo', format(date, 'yyyy-MM-dd'));
    }
    setDateToOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onToggle}
          className={cn(
            "transition-all duration-300 hover:shadow-card",
            isOpen && "bg-primary/10 border-primary/30"
          )}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres avancés
          {activeFiltersCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {isOpen && (
        <ArgonCard variant="glass" className="animate-fade-in">
          <ArgonCardHeader>
            <ArgonCardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Filtres de recherche
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </ArgonCardTitle>
          </ArgonCardHeader>
          
          <ArgonCardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-medium">
                  Recherche textuelle
                </Label>
                <Input
                  id="search"
                  placeholder="ID, expéditeur, objet..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Document Type */}
              <div className="space-y-2">
                <Label htmlFor="documentType" className="text-sm font-medium">
                  Type de document
                </Label>
                <Select value={filters.documentType} onValueChange={(value) => handleFilterChange('documentType', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date de début</Label>
                <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal transition-all duration-200 hover:bg-accent/20",
                        !filters.dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? (
                        format(new Date(filters.dateFrom), 'dd/MM/yyyy', { locale: fr })
                      ) : (
                        "Sélectionner une date"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
                      onSelect={handleDateFromSelect}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date de fin</Label>
                <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal transition-all duration-200 hover:bg-accent/20",
                        !filters.dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? (
                        format(new Date(filters.dateTo), 'dd/MM/yyyy', { locale: fr })
                      ) : (
                        "Sélectionner une date"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
                      onSelect={handleDateToSelect}
                      disabled={(date) =>
                        date > new Date() || 
                        date < new Date("1900-01-01") ||
                        (filters.dateFrom && date < new Date(filters.dateFrom))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="pt-4 border-t border-border/50">
                <Label className="text-sm font-medium mb-3 block">Filtres actifs :</Label>
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Search className="h-3 w-3" />
                      Recherche: {filters.search}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => handleFilterChange('search', '')}
                      />
                    </Badge>
                  )}
                  {filters.documentType !== 'Tous' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Type: {filters.documentType}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => handleFilterChange('documentType', 'Tous')}
                      />
                    </Badge>
                  )}
                  {filters.dateFrom && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Depuis: {format(new Date(filters.dateFrom), 'dd/MM/yyyy', { locale: fr })}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => handleFilterChange('dateFrom', '')}
                      />
                    </Badge>
                  )}
                  {filters.dateTo && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Jusqu'au: {format(new Date(filters.dateTo), 'dd/MM/yyyy', { locale: fr })}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive" 
                        onClick={() => handleFilterChange('dateTo', '')}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </ArgonCardContent>
        </ArgonCard>
      )}
    </div>
  );
};