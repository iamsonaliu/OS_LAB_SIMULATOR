import MetricsCard from '../Common/MetricsCard';
import { parseBase64Image } from '../../utils/helpers';

export default function DiskResults({ results, algorithm }) {
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Performance Metrics
        </h2>
        <MetricsCard metrics={results.metrics} type="disk" />
      </div>

      {/* Visualization */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Head Movement Visualization - {algorithm}
        </h2>
        {results.visualization && (
          <img
            src={parseBase64Image(results.visualization)}
            alt="Disk Scheduling Visualization"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
          />
        )}
      </div>

      {/* Service Sequence */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Service Sequence
        </h2>
        <div className="flex flex-wrap gap-2">
          {results.sequence.map((cylinder, index) => (
            <div key={index} className="flex items-center">
              <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-semibold">
                {cylinder}
              </span>
              {index < results.sequence.length - 1 && (
                <span className="mx-2 text-gray-400">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trace Table */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Seek Movement Trace
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Step</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">From</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">To</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Seek Distance</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {results.trace.map((step, index) => (
                <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{step.step}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{step.from_cylinder}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{step.to_cylinder}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded font-semibold">
                      {step.seek_distance}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-semibold">
                      {step.cumulative_seek}
                    </span>
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
