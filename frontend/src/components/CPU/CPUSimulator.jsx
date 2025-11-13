import { useState } from 'react';
import { Play, Download, RotateCcw, BarChart3, Settings } from 'lucide-react';
import { cpuAPI } from '../../services/api';
import ProcessForm from './ProcessForm';
import CPUResults from './CPUResults';
import LoadingSpinner from '../Common/LoadingSpinner';
import AlgorithmCard from '../Common/AlgorithmCard';
import ComparisonMode from '../Common/ComparisonMode';

export default function CPUSimulator() {
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [processes, setProcesses] = useState([
    { pid: 1, arrival: 0, burst: 5, priority: 0 },
    { pid: 2, arrival: 1, burst: 3, priority: 0 },
    { pid: 3, arrival: 2, burst: 8, priority: 0 }
  ]);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  const algorithms = [
    { id: 'FCFS', name: 'FCFS', description: 'First Come First Serve - Non-preemptive', color: 'blue' },
    { id: 'SJF', name: 'SJF', description: 'Shortest Job First - Non-preemptive', color: 'green' },
    { id: 'SRTF', name: 'SRTF', description: 'Shortest Remaining Time First - Preemptive', color: 'purple' },
    { id: 'Priority', name: 'Priority', description: 'Priority-based scheduling', color: 'orange' },
    { id: 'RoundRobin', name: 'Round Robin', description: 'Time-quantum based scheduling', color: 'pink' },
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
    setComparisonMode(false);
    setComparisonResults(null);

    try {
      const data = await cpuAPI.simulate({
        algorithm,
        processes,
        time_quantum: algorithm === 'RoundRobin' ? timeQuantum : null,
      });
      setResults(data);
    } catch (err) {
      setError(err.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const runComparison = async (selectedAlgorithms) => {
    setComparisonLoading(true);
    setError(null);
    setComparisonResults(null);
    setResults(null);

    try {
      const comparisonData = {};
      
      for (const algo of selectedAlgorithms) {
        try {
          const data = await cpuAPI.simulate({
            algorithm: algo,
            processes,
            time_quantum: algo === 'RoundRobin' ? timeQuantum : null,
          });
          comparisonData[algo] = {
            avg_waiting_time: data.metrics.avg_waiting_time,
            avg_turnaround_time: data.metrics.avg_turnaround_time,
            cpu_utilization: data.metrics.cpu_utilization,
            throughput: data.metrics.throughput,
          };
        } catch (err) {
          console.error(`Error simulating ${algo}:`, err);
          comparisonData[algo] = { error: err.message || 'Simulation failed' };
        }
      }
      
      setComparisonResults(comparisonData);
    } catch (err) {
      setError(err.message || 'Comparison failed');
    } finally {
      setComparisonLoading(false);
    }
  };

  const resetSimulation = () => {
    setResults(null);
    setError(null);
    setComparisonMode(false);
    setComparisonResults(null);
    setProcesses([
      { pid: 1, arrival: 0, burst: 5, priority: 0 },
      { pid: 2, arrival: 1, burst: 3, priority: 0 },
      { pid: 3, arrival: 2, burst: 8, priority: 0 }
    ]);
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
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CPU Scheduling Simulator</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Simulate and compare different CPU scheduling algorithms
          </p>
        </div>
        <button
          onClick={() => {
            setComparisonMode(!comparisonMode);
            setResults(null);
            setComparisonResults(null);
          }}
          className={`btn-secondary flex items-center space-x-2 ${
            comparisonMode ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-500' : ''
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{comparisonMode ? 'Single Mode' : 'Comparison Mode'}</span>
        </button>
      </div>

      {/* Comparison Mode */}
      {comparisonMode ? (
        <ComparisonMode
          algorithms={algorithms.map(a => a.id)}
          onCompare={runComparison}
          comparisonData={comparisonResults}
          loading={comparisonLoading}
          type="cpu"
          onClose={() => {
            setComparisonMode(false);
            setComparisonResults(null);
          }}
        />
      ) : (
        <>
          {/* Algorithm Selection */}
          <div className="card animate-fade-in">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Select Algorithm
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
              <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Time slice for each process in Round Robin scheduling
                </p>
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
        </>
      )}

      {/* Error */}
      {error && (
        <div className="card bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 animate-slide-down">
          <div className="flex items-center space-x-2">
            <span className="text-red-600 dark:text-red-400 font-semibold">Error:</span>
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner message="Running CPU scheduling simulation..." />}

      {/* Results */}
      {results && !comparisonMode && <CPUResults results={results} algorithm={algorithm} />}
    </div>
  );
}
