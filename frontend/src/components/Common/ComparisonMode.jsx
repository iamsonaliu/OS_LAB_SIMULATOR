import { useState } from 'react';
import { Play, X, BarChart3, TrendingUp, Download } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ComparisonChart from '../Charts/ComparisonChart';
import { downloadJSON } from '../../utils/helpers';

export default function ComparisonMode({ 
  algorithms, 
  onCompare, 
  comparisonData, 
  loading, 
  type = 'cpu',
  onClose 
}) {
  const [selectedAlgos, setSelectedAlgos] = useState(
    type === 'cpu' ? ['FCFS', 'SJF', 'SRTF'] :
    type === 'disk' ? ['FCFS', 'SSTF', 'SCAN'] :
    ['FIFO', 'LRU', 'Optimal']
  );
  const [selectedMetric, setSelectedMetric] = useState(
    type === 'cpu' ? 'avg_waiting_time' :
    type === 'disk' ? 'total_seek' :
    'page_faults'
  );

  const toggleAlgo = (algo) => {
    if (selectedAlgos.includes(algo)) {
      if (selectedAlgos.length > 2) {
        setSelectedAlgos(selectedAlgos.filter(a => a !== algo));
      }
    } else {
      setSelectedAlgos([...selectedAlgos, algo]);
    }
  };

  const handleCompare = () => {
    if (selectedAlgos.length >= 2 && onCompare) {
      onCompare(selectedAlgos);
    }
  };

  const handleDownload = () => {
    if (comparisonData) {
      downloadJSON(comparisonData, `comparison_${type}_${Date.now()}.json`);
    }
  };

  const getMetrics = () => {
    if (type === 'cpu') {
      return [
        { key: 'avg_waiting_time', label: 'Average Waiting Time', icon: TrendingUp },
        { key: 'avg_turnaround_time', label: 'Average Turnaround Time', icon: BarChart3 },
        { key: 'cpu_utilization', label: 'CPU Utilization', icon: TrendingUp },
        { key: 'throughput', label: 'Throughput', icon: BarChart3 },
      ];
    } else if (type === 'disk') {
      return [
        { key: 'total_seek', label: 'Total Seek Time', icon: TrendingUp },
        { key: 'avg_seek', label: 'Average Seek Time', icon: BarChart3 },
      ];
    } else {
      return [
        { key: 'page_faults', label: 'Page Faults', icon: TrendingUp },
        { key: 'hit_ratio', label: 'Hit Ratio', icon: BarChart3 },
      ];
    }
  };

  const metrics = getMetrics();

  return (
    <div className="card animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            <span>Algorithm Comparison</span>
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Compare multiple algorithms side-by-side with the same input
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="btn-ghost p-2 hover:bg-red-50 dark:hover:bg-red-900/20"
            aria-label="Close comparison"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>

      {/* Algorithm Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select Algorithms to Compare (minimum 2):
        </label>
        <div className="flex flex-wrap gap-2">
          {algorithms.map(algo => {
            const isSelected = selectedAlgos.includes(algo);
            return (
              <button
                key={algo}
                onClick={() => toggleAlgo(algo)}
                disabled={isSelected && selectedAlgos.length <= 2}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {algo}
              </button>
            );
          })}
        </div>
        {selectedAlgos.length < 2 && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            Please select at least 2 algorithms to compare
          </p>
        )}
      </div>

      {/* Action Button */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleCompare}
          disabled={loading || selectedAlgos.length < 2}
          className="btn-primary flex items-center space-x-2"
        >
          <Play className="w-4 h-4" />
          <span>{loading ? 'Comparing...' : 'Run Comparison'}</span>
        </button>
        {comparisonData && (
          <button
            onClick={handleDownload}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Results</span>
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-8">
          <LoadingSpinner message="Running algorithm comparison..." />
        </div>
      )}

      {/* Comparison Results */}
      {comparisonData && !loading && (
        <div className="space-y-6 animate-slide-up">
          {/* Metric Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Metric to Visualize:
            </label>
            <div className="flex flex-wrap gap-2">
              {metrics.map(metric => (
                <button
                  key={metric.key}
                  onClick={() => setSelectedMetric(metric.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    selectedMetric === metric.key
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-2 border-primary-500'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 border-transparent'
                  }`}
                >
                  <metric.icon className="w-4 h-4" />
                  <span>{metric.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Chart */}
          <ComparisonChart
            comparisonData={comparisonData}
            metric={selectedMetric}
            type={type}
          />

          {/* Comparison Table */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Detailed Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Algorithm
                    </th>
                    {metrics.map(metric => (
                      <th key={metric.key} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {metric.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(comparisonData).map(([algo, metrics]) => (
                    <tr
                      key={algo}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{algo}</td>
                      {getMetrics().map(metric => (
                        <td key={metric.key} className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {typeof metrics[metric.key] === 'number'
                            ? metrics[metric.key].toFixed(metric.key.includes('ratio') || metric.key.includes('utilization') ? 2 : 2)
                            : metrics[metric.key] || '—'}
                          {metric.key.includes('ratio') || metric.key.includes('utilization') ? '%' : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
