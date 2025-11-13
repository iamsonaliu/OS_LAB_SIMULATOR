import { useState } from 'react';
import { Play, Download, RotateCcw, BarChart3, Settings } from 'lucide-react';
import { diskAPI } from '../../services/api';
import DiskForm from './DiskForm';
import DiskResults from './DiskResults';
import LoadingSpinner from '../Common/LoadingSpinner';
import AlgorithmCard from '../Common/AlgorithmCard';
import ComparisonMode from '../Common/ComparisonMode';

export default function DiskSimulator() {
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [requestQueue, setRequestQueue] = useState('98 183 37 122 14 124 65 67');
  const [initialHead, setInitialHead] = useState(53);
  const [diskSize, setDiskSize] = useState(200);
  const [direction, setDirection] = useState('right');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  const algorithms = [
    { id: 'FCFS', name: 'FCFS', description: 'First Come First Serve', color: 'blue' },
    { id: 'SSTF', name: 'SSTF', description: 'Shortest Seek Time First', color: 'green' },
    { id: 'SCAN', name: 'SCAN', description: 'Elevator Algorithm', color: 'purple' },
    { id: 'C-SCAN', name: 'C-SCAN', description: 'Circular SCAN', color: 'orange' },
    { id: 'LOOK', name: 'LOOK', description: 'Modified SCAN', color: 'pink' },
    { id: 'C-LOOK', name: 'C-LOOK', description: 'Circular LOOK', color: 'indigo' },
  ];

  const needsDirection = ['SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'].includes(algorithm);

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setComparisonMode(false);
    setComparisonResults(null);

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
      const requests = requestQueue.split(/\s+/).map(r => parseInt(r)).filter(r => !isNaN(r));
      if (requests.length === 0) {
        throw new Error('Please enter valid cylinder numbers');
      }

      const comparisonData = {};
      
      for (const algo of selectedAlgorithms) {
        try {
          const needsDir = ['SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'].includes(algo);
          const data = await diskAPI.simulate({
            algorithm: algo,
            request_queue: requests,
            initial_head: initialHead,
            disk_size: diskSize,
            direction: needsDir ? direction : undefined,
          });
          comparisonData[algo] = {
            total_seek: data.metrics.total_seek,
            avg_seek: data.metrics.avg_seek,
            max_seek: data.metrics.max_seek,
            min_seek: data.metrics.min_seek,
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
    setRequestQueue('98 183 37 122 14 124 65 67');
    setInitialHead(53);
    setDiskSize(200);
    setDirection('right');
    setAlgorithm('FCFS');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Disk Scheduling Simulator</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Simulate and compare different disk scheduling algorithms
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
          type="disk"
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
      {loading && <LoadingSpinner message="Running disk scheduling simulation..." />}

      {/* Results */}
      {results && !comparisonMode && (
        <DiskResults 
          results={results} 
          algorithm={algorithm}
          initialHead={initialHead}
        />
      )}
    </div>
  );
}
