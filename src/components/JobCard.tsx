import { QuantumJob } from '@/types/quantum';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Cpu, Target, Hash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: QuantumJob;
}

const getStatusVariant = (status: QuantumJob['status']) => {
  switch (status) {
    case 'QUEUED':
      return 'secondary';
    case 'RUNNING':
      return 'default';
    case 'DONE':
      return 'default';
    case 'ERROR':
      return 'destructive';
    case 'VALIDATING':
      return 'secondary';
    default:
      return 'secondary';
  }
};

const getStatusColor = (status: QuantumJob['status']) => {
  switch (status) {
    case 'QUEUED':
      return 'text-quantum-warning';
    case 'RUNNING':
      return 'text-quantum-blue animate-pulse-quantum';
    case 'DONE':
      return 'text-quantum-success';
    case 'ERROR':
      return 'text-quantum-error';
    case 'VALIDATING':
      return 'text-quantum-cyan';
    default:
      return 'text-muted-foreground';
  }
};

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="card-gradient border-border hover:border-primary/30 transition-all duration-300 hover:quantum-glow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="h-4 w-4 text-primary" />
              <h3 className="font-mono text-sm text-foreground truncate">
                {job.id}
              </h3>
            </div>
            {job.name && (
              <p className="text-muted-foreground text-sm mb-2">{job.name}</p>
            )}
          </div>
          <Badge 
            variant={getStatusVariant(job.status)}
            className={`${getStatusColor(job.status)} font-medium`}
          >
            {job.status}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Backend</span>
            <span className="font-mono text-primary">{job.backend}</span>
          </div>

          {job.position && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Queue Position</span>
              <span className="font-medium text-quantum-warning">#{job.position}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/50">
            {job.shots && (
              <div className="flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {job.shots.toLocaleString()}
                </span>
              </div>
            )}
            
            {job.qubits && (
              <div className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {job.qubits}Q
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(job.created), { addSuffix: true })}
              </span>
            </div>
          </div>

          {job.tags && job.tags.length > 0 && (
            <div className="flex gap-1 pt-2">
              {job.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs px-2 py-0.5 border-muted-foreground/20"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}