import MetricsCard from '../Common/MetricsCard';
import { parseBase64Image } from '../../utils/helpers';
import { CheckCircle, XCircle } from 'lucide-react';

export default function PageResults({ results, algorithm }) {
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Performance Metrics
        </h2>
        <MetricsCard metrics={results.metrics} type="page" />
      </div>

      {/* Visualization */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Frame State Visualization - {algorithm}
        </h2>
        {results.visualization && (
          <img
            src={parseBase64Image(results.visualization)}
            alt="Page Replacement Visualization"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
          />
        )}
      </div>

      {/* Trace Table */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Page Reference Trace
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Step</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Page</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Frames</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.trace.map((step, index) => (
                <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{step.step}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-semibold">{step.page}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      {step.frames_state.map((frame, i) => (
                        <span
                          key={i}
                          className={`px-2 py-1 rounded text-sm font-mono ${
                            frame === -1
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                              : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          }`}
                        >
                          {frame === -1 ? '_' : frame}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {step.status === 'HIT' ? (
                      <span className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-semibold">HIT</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span className="font-semibold">FAULT</span>
                      </span>
                    )}
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