export interface QuantumJob {
  id: string;
  name?: string;
  status: 'INITIALIZING' | 'QUEUED' | 'VALIDATING' | 'RUNNING' | 'CANCELLED' | 'DONE' | 'ERROR';
  backend: string;
  created: string;
  timePerStep?: {
    [key: string]: string;
  };
  position?: number;
  estimatedStartTime?: string;
  estimatedCompleteTime?: string;
  tags?: string[];
  shots?: number;
  qubits?: number;
  circuitDepth?: number;
}

export interface QuantumBackend {
  name: string;
  status: 'operational' | 'maintenance' | 'offline';
  qubits: number;
  pending_jobs: number;
  description?: string;
}

export interface QuantumJobStats {
  total: number;
  queued: number;
  running: number;
  completed: number;
  failed: number;
}