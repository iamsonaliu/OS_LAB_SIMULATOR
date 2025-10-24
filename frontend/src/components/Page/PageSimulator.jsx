import { useState } from 'react';
import { Play, Download, RotateCcw } from 'lucide-react';
import { pageAPI } from '../../services/api';
import PageForm from './PageForm';
import PageResults from './PageResults';
import LoadingSpinner from '../Common/LoadingSpinner';
import AlgorithmCard from '../Common/AlgorithmCard';

export default function PageSimulator() {
  const [algorithm, setAlgorithm] = useState('FIFO');
  const [pageSequence, setPageSequence] = useState('7 0 1 2 0 3 0 4 2 3');
  const [frameCount, setFrameCount] = useState(3);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const algorithms = [
    { id: 'FIFO', name: 'FIFO', description: 'First In First Out' },
    { id: 'LRU', name: 'LRU', description: 'Least Recently Used' },
    { id: 'Optimal', name: 'Optimal', description: "Belady's Algorithm" },
    { id: 'LFU', name: 'LFU', description: 'Least Frequently Used' },
  ];

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const pages = pageSequence.split(/\s+/).map(p => parseInt(p)).filter(p => !isNaN(p));
      if (pages.length === 0) {
        throw new Error('Please enter valid page numbers');
      }

      const data = await pageAPI.simulate({
        algorithm,
        page_sequence: pages,
        frame_count: frameCount,
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
    setPageSequence('7 0 1 2 0 3 0 4 2 3');
    setFrameCount(3);
    setAlgorithm('FIFO');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Algorithm Selection */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Select Algorithm
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
      <PageForm
        pageSequence={pageSequence}
        setPageSequence={setPageSequence}
        frameCount={frameCount}
        setFrameCount={setFrameCount}
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
      {loading && <LoadingSpinner message="Running page replacement simulation..." />}

      {/* Results */}
      {results && <PageResults results={results} algorithm={algorithm} />}
    </div>
  );
}