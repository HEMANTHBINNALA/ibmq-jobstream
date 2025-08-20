import { QuantumJob, QuantumBackend } from '@/types/quantum';

// Mock data for demonstration since IBM Quantum API requires authentication
// In a real implementation, you would use the IBM Quantum API
const MOCK_BACKENDS = [
  'ibm_brisbane', 'ibm_kyoto', 'ibm_osaka', 'ibm_sherbrooke', 
  'ibm_torino', 'ibm_nazca', 'ibm_fez', 'ibm_kawasaki'
];

const STATUSES = ['QUEUED', 'RUNNING', 'DONE', 'ERROR', 'VALIDATING'] as const;

const generateMockJob = (): QuantumJob => {
  const id = `job_${Math.random().toString(36).substr(2, 9)}`;
  const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
  const backend = MOCK_BACKENDS[Math.floor(Math.random() * MOCK_BACKENDS.length)];
  const created = new Date(Date.now() - Math.random() * 86400000 * 7).toISOString();
  
  return {
    id,
    name: `quantum_circuit_${id.slice(-4)}`,
    status,
    backend,
    created,
    position: status === 'QUEUED' ? Math.floor(Math.random() * 50) + 1 : undefined,
    shots: Math.floor(Math.random() * 8192) + 1024,
    qubits: Math.floor(Math.random() * 127) + 5,
    circuitDepth: Math.floor(Math.random() * 100) + 10,
    tags: ['research', 'optimization'].slice(0, Math.floor(Math.random() * 2) + 1)
  };
};

export const quantumService = {
  async getJobs(): Promise<QuantumJob[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Generate 15-25 mock jobs
    const jobCount = Math.floor(Math.random() * 10) + 15;
    return Array.from({ length: jobCount }, generateMockJob)
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
  },

  async getBackends(): Promise<QuantumBackend[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return MOCK_BACKENDS.map(name => ({
      name,
      status: Math.random() > 0.2 ? 'operational' : 'maintenance',
      qubits: Math.floor(Math.random() * 120) + 5,
      pending_jobs: Math.floor(Math.random() * 100)
    }));
  }
};