import { useState } from 'react';
import { Play, Plus, Download, RotateCcw } from 'lucide-react';
import { cpuAPI } from '../../services/api';
import ProcessForm from './ProcessForm';
import CPUResults from './CPUResults';
import LoadingSpinner from '../Common/LoadingSpinner';
import AlgorithmCard from '../Common/AlgorithmCard';

export default function CPUSimulator() {
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [processes, setProcesses] = useState([
    { pid: 1, arrival: 0, burst: 5, priority: 0 }
  ]);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const algorithms = [
    { id: 'FCFS', name: 'FCFS', description: 'First Come First Serve - Non-preemptive' },
    { id: 'SJF', name: 'SJF', description: 'Shortest Job First - Non-preemptive' },
    { id: 'SRTF', name: 'SRTF', description: 'Shortest Remaining Time First - Preemptive' },
    { id: 'Priority', name: 'Priority', description: 'Priority-based scheduling' },
    { id: 'RoundRobin', name: 'Round Robin', description: 'Time-quantum based scheduling' },
  ];

  const addProcess = () => {
    const newPid = Math.max(...processes.map(p => p.pid), 0) + 1;
    setProcesses([...processes, { pid: newPid, arrival: 0, burst: 1, priority: 0 }]);
  };

  const removeProcess = (index) => {
    if (processes.length > 1) {
      setProcesses(processes.filter((_, i) => i !== index));
    }
  };

  const updateProcess = (index, field, value) => {
    const updated = [...processes];
    updated[index][field] = parseInt(value) || 0;
    setProcesses(updated);
  };

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await cpuAPI.simulate({
        algorithm,
        processes,
        time_quantum: algorithm === 'RoundRobin' ? timeQuantum : null,
      });
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetSimulation = () => {
    setResults(null);
    setError(null);
    setProcesses([{ pid: 1, arrival: 0, burst: 5, priority: 0 }]);
    setAlgorithm('FCFS');
    setTimeQuantum(2);
  };

  const downloadResults = () => {
    if (results) {
      const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cpu_${algorithm}_${Date.now()}.json`;
      link.click();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Algorithm Selection */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Select Algorithm
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {algorithms.map((algo) => (
            <AlgorithmCard
              key={algo.id}
              name={algo.name}
              description={algo.description}
              selected={algorithm === algo.id}
              onClick={() => setAlgorithm(algo.id)}
            />
          ))}
        </div>

        {algorithm === 'RoundRobin' && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Time Quantum
            </label>
            <input
              type="number"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
              className="input-field w-32"
              min="1"
              max="10"
            />
          </div>
        )}
      </div>

      {/* Process Input */}
      <ProcessForm
        processes={processes}
        onAdd={addProcess}
        onRemove={removeProcess}
        onUpdate={updateProcess}
        showPriority={algorithm === 'Priority'}
      />

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={runSimulation}
          disabled={loading || processes.length === 0}
          className="btn-primary flex items-center space-x-2"
        >
          <Play className="w-4 h-4" />
          <span>{loading ? 'Running...' : 'Run Simulation'}</span>
        </button>

        <button
          onClick={resetSimulation}
          className="btn-secondary flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>

        {results && (
          <button
            onClick={downloadResults}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Results</span>
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner message="Running CPU scheduling simulation..." />}

      {/* Results */}
      {results && <CPUResults results={results} algorithm={algorithm} />}
    </div>
  );
}