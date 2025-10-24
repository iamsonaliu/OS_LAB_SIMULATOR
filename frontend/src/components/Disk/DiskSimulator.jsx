import { useState } from 'react';
import { Play, Download, RotateCcw } from 'lucide-react';
import { diskAPI } from '../../services/api';
import DiskForm from './DiskForm';
import DiskResults from './DiskResults';
import LoadingSpinner from '../Common/LoadingSpinner';
import AlgorithmCard from '../Common/AlgorithmCard';

export default function DiskSimulator() {
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [requestQueue, setRequestQueue] = useState('98 183 37 122 14 124 65 67');
  const [initialHead, setInitialHead] = useState(53);
  const [diskSize, setDiskSize] = useState(200);
  const [direction, setDirection] = useState('right');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const algorithms = [
    { id: 'FCFS', name: 'FCFS', description: 'First Come First Serve' },
    { id: 'SSTF', name: 'SSTF', description: 'Shortest Seek Time First' },
    { id: 'SCAN', name: 'SCAN', description: 'Elevator Algorithm' },
    { id: 'C-SCAN', name: 'C-SCAN', description: 'Circular SCAN' },
    { id: 'LOOK', name: 'LOOK', description: 'Modified SCAN' },
    { id: 'C-LOOK', name: 'C-LOOK', description: 'Circular LOOK' },
  ];

  const needsDirection = ['SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'].includes(algorithm);

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const requests = requestQueue.split(/\s+/).map(r => parseInt(r)).filter(r => !isNaN(r));
      if (requests.length === 0) {
        throw new Error('Please enter valid cylinder numbers');
      }

      const data = await diskAPI.simulate({
        algorithm,
        request_queue: requests,
        initial_head: initialHead,
        disk_size: diskSize,
        direction: needsDirection ? direction : undefined,
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
    setRequestQueue('98 183 37 122 14 124 65 67');
    setInitialHead(53);
    setDiskSize(200);
    setDirection('right');
    setAlgorithm('FCFS');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Algorithm Selection */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Select Algorithm
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
      </div>

      {/* Input Form */}
      <DiskForm
        requestQueue={requestQueue}
        setRequestQueue={setRequestQueue}
        initialHead={initialHead}
        setInitialHead={setInitialHead}
        diskSize={diskSize}
        setDiskSize={setDiskSize}
        direction={direction}
        setDirection={setDirection}
        needsDirection={needsDirection}
      />

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={runSimulation}
          disabled={loading}
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
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner message="Running disk scheduling simulation..." />}

      {/* Results */}
      {results && <DiskResults results={results} algorithm={algorithm} />}
    </div>
  );
}