import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { quantumService } from '@/services/quantumService';
import { QuantumJob } from '@/types/quantum';
import { JobCard } from './JobCard';
import { DashboardStats } from './DashboardStats';
import { JobFilters } from './JobFilters';
import { Button } from '@/components/ui/button';
import { RefreshCw, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function QuantumDashboard() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    backend: ''
  });

  const { 
    data: jobs = [], 
    isLoading, 
    error, 
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ['quantum-jobs'],
    queryFn: quantumService.getJobs,
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 3,
  });

  // Filter jobs based on active filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job: QuantumJob) => {
      const matchesSearch = !filters.search || 
        job.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.name?.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || job.status === filters.status;
      const matchesBackend = !filters.backend || job.backend === filters.backend;
      
      return matchesSearch && matchesStatus && matchesBackend;
    });
  }, [jobs, filters]);

  // Get unique backends for filter dropdown
  const availableBackends = useMemo(() => {
    return Array.from(new Set(jobs.map((job: QuantumJob) => job.backend))).sort();
  }, [jobs]);

  const handleRefresh = async () => {
    try {
      await refetch();
      toast({
        title: "Jobs refreshed",
        description: "Latest quantum job data has been loaded.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Unable to fetch latest job data. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-quantum-error text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground">Unable to load quantum jobs</h2>
          <p className="text-muted-foreground">Please check your connection and try again.</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 quantum-gradient rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-background" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  IBM Quantum Jobs
                </h1>
                <p className="text-sm text-muted-foreground">
                  Live quantum computing job monitoring
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              disabled={isFetching}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="quantum-gradient rounded-full p-4 w-16 h-16 mx-auto animate-pulse-quantum">
                <Zap className="h-8 w-8 text-background" />
              </div>
              <p className="text-muted-foreground">Loading quantum jobs...</p>
            </div>
          </div>
        ) : (
          <>
            <DashboardStats jobs={jobs} />
            
            <JobFilters
              onSearchChange={(search) => setFilters(prev => ({ ...prev, search }))}
              onStatusFilter={(status) => setFilters(prev => ({ ...prev, status }))}
              onBackendFilter={(backend) => setFilters(prev => ({ ...prev, backend }))}
              activeFilters={filters}
              availableBackends={availableBackends}
            />

            {filteredJobs.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-muted-foreground text-4xl">🔍</div>
                <h3 className="text-xl font-semibold text-foreground">No jobs found</h3>
                <p className="text-muted-foreground">
                  {filters.search || filters.status || filters.backend
                    ? 'Try adjusting your filters or search terms.'
                    : 'No quantum jobs are currently available.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job: QuantumJob) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}