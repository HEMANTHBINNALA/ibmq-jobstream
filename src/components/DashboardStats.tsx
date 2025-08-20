import { QuantumJob } from '@/types/quantum';
import { Card } from '@/components/ui/card';
import { Activity, Clock, CheckCircle, XCircle } from 'lucide-react';

interface DashboardStatsProps {
  jobs: QuantumJob[];
}

export function DashboardStats({ jobs }: DashboardStatsProps) {
  const stats = {
    total: jobs.length,
    queued: jobs.filter(job => job.status === 'QUEUED').length,
    running: jobs.filter(job => job.status === 'RUNNING').length,
    completed: jobs.filter(job => job.status === 'DONE').length,
    failed: jobs.filter(job => job.status === 'ERROR').length,
  };

  const statCards = [
    {
      title: 'Total Jobs',
      value: stats.total,
      icon: Activity,
      color: 'text-foreground',
      gradient: 'quantum-gradient'
    },
    {
      title: 'Queued',
      value: stats.queued,
      icon: Clock,
      color: 'text-quantum-warning',
      gradient: ''
    },
    {
      title: 'Running',
      value: stats.running,
      icon: Activity,
      color: 'text-quantum-blue',
      gradient: ''
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-quantum-success',
      gradient: ''
    },
    {
      title: 'Failed',
      value: stats.failed,
      icon: XCircle,
      color: 'text-quantum-error',
      gradient: ''
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={stat.title} 
            className={`card-gradient border-border hover:border-primary/30 transition-all duration-300 ${
              stat.gradient ? 'quantum-glow' : ''
            }`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}