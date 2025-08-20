import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

interface JobFiltersProps {
  onSearchChange: (search: string) => void;
  onStatusFilter: (status: string) => void;
  onBackendFilter: (backend: string) => void;
  activeFilters: {
    search: string;
    status: string;
    backend: string;
  };
  availableBackends: string[];
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'QUEUED', label: 'Queued' },
  { value: 'RUNNING', label: 'Running' },
  { value: 'DONE', label: 'Completed' },
  { value: 'ERROR', label: 'Failed' },
  { value: 'VALIDATING', label: 'Validating' },
];

export function JobFilters({ 
  onSearchChange, 
  onStatusFilter, 
  onBackendFilter, 
  activeFilters,
  availableBackends 
}: JobFiltersProps) {
  const [localSearch, setLocalSearch] = useState(activeFilters.search);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const clearAllFilters = () => {
    setLocalSearch('');
    onSearchChange('');
    onStatusFilter('');
    onBackendFilter('');
  };

  const hasActiveFilters = activeFilters.search || activeFilters.status || activeFilters.backend;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs by ID or name..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 bg-card border-border focus:border-primary"
            />
          </div>
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex gap-2">
          <Select value={activeFilters.status} onValueChange={onStatusFilter}>
            <SelectTrigger className="w-40 bg-card border-border">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={activeFilters.backend} onValueChange={onBackendFilter}>
            <SelectTrigger className="w-48 bg-card border-border">
              <SelectValue placeholder="Backend" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Backends</SelectItem>
              {availableBackends.map((backend) => (
                <SelectItem key={backend} value={backend}>
                  {backend}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {activeFilters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {activeFilters.search}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setLocalSearch('');
                  onSearchChange('');
                }}
              />
            </Badge>
          )}
          
          {activeFilters.status && (
            <Badge variant="secondary" className="gap-1">
              Status: {activeFilters.status}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onStatusFilter('')}
              />
            </Badge>
          )}
          
          {activeFilters.backend && (
            <Badge variant="secondary" className="gap-1">
              Backend: {activeFilters.backend}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onBackendFilter('')}
              />
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}