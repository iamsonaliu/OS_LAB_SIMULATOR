import { useState } from 'react';
import { Play, Download, RotateCcw, BarChart3, Settings } from 'lucide-react';
import { pageAPI } from '../../services/api';
import PageForm from './PageForm';
import PageResults from './PageResults';
import LoadingSpinner from '../Common/LoadingSpinner';
import AlgorithmCard from '../Common/AlgorithmCard';
import ComparisonMode from '../Common/ComparisonMode';

export default function PageSimulator() {
  const [algorithm, setAlgorithm] = useState('FIFO');
  const [pageSequence, setPageSequence] = useState('7 0 1 2 0 3 0 4 2 3');
  const [frameCount, setFrameCount] = useState(3);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  const algorithms = [
    { id: 'FIFO', name: 'FIFO', description: 'First In First Out', color: 'blue' },
    { id: 'LRU', name: 'LRU', description: 'Least Recently Used', color: 'green' },
    { id: 'Optimal', name: 'Optimal', description: "Belady's Algorithm", color: 'purple' },
    { id: 'LFU', name: 'LFU', description: 'Least Frequently Used', color: 'orange' },
  ];

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setComparisonMode(false);
    setComparisonResults(null);

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
      const pages = pageSequence.split(/\s+/).map(p => parseInt(p)).filter(p => !isNaN(p));
      if (pages.length === 0) {
        throw new Error('Please enter valid page numbers');
      }

      const comparisonData = {};
      
      for (const algo of selectedAlgorithms) {
        try {
          const data = await pageAPI.simulate({
            algorithm: algo,
            page_sequence: pages,
            frame_count: frameCount,
          });
          comparisonData[algo] = {
            page_faults: data.metrics.page_faults,
            page_hits: data.metrics.page_hits,
            hit_ratio: data.metrics.hit_ratio,
            fault_ratio: data.metrics.fault_ratio,
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
    setPageSequence('7 0 1 2 0 3 0 4 2 3');
    setFrameCount(3);
    setAlgorithm('FIFO');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Page Replacement Simulator</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Simulate and compare different page replacement algorithms
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
          type="page"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      {loading && <LoadingSpinner message="Running page replacement simulation..." />}

      {/* Results */}
      {results && !comparisonMode && (
        <PageResults 
          results={results} 
          algorithm={algorithm}
          frameCount={frameCount}
        />
      )}
    </div>
  );
}
