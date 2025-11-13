import MetricsCard from '../Common/MetricsCard';
import DiskMovementChart from '../Charts/DiskMovementChart';
import { TrendingUp, Activity, Cpu, Clock } from 'lucide-react';

export default function DiskResults({ results, algorithm, initialHead }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metrics */}
      <div>
        <h2 className="section-title">Performance Metrics</h2>
        <p className="section-subtitle">
          Key performance indicators for the {algorithm} algorithm
        </p>
        <MetricsCard metrics={results.metrics} type="disk" />
      </div>

      {/* Interactive Charts */}
      <DiskMovementChart
        sequence={results.sequence}
        trace={results.trace}
        initialHead={initialHead}
        algorithm={algorithm}
      />

      {/* Service Sequence */}
      <div className="card">
        <h2 className="section-title">Service Sequence</h2>
        <p className="section-subtitle">
          Order of serviced disk requests
        </p>
        <div className="flex flex-wrap gap-3">
          {results.sequence.map((cylinder, index) => (
            <div key={index} className="flex items-center">
              <span className="badge-info text-lg px-5 py-2">
                {cylinder}
              </span>
              {index < results.sequence.length - 1 && (
                <span className="mx-2 text-gray-400 dark:text-gray-500 text-xl">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trace Table */}
      <div className="card">
        <h2 className="section-title">Seek Movement Trace</h2>
        <p className="section-subtitle">
          Detailed step-by-step seek movement information
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Step</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">From</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">To</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Seek Distance</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {results.trace.map((step, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{step.step}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{step.from_cylinder}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{step.to_cylinder}</td>
                  <td className="px-4 py-3">
                    <span className="badge-error">{step.seek_distance}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge-success">{step.cumulative_seek}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
