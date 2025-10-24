import MetricsCard from '../Common/MetricsCard';
import { parseBase64Image } from '../../utils/helpers';

export default function CPUResults({ results, algorithm }) {
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Performance Metrics
        </h2>
        <MetricsCard metrics={results.metrics} type="cpu" />
      </div>

      {/* Gantt Chart */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Gantt Chart - {algorithm}
        </h2>
        {results.gantt_chart && (
          <img
            src={parseBase64Image(results.gantt_chart)}
            alt="Gantt Chart"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
          />
        )}
      </div>

      {/* Process Details Table */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Process Execution Details
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">PID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Arrival</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Burst</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Start</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Finish</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Turnaround</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Waiting</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Response</th>
              </tr>
            </thead>
            <tbody>
              {results.processes.map((proc, index) => (
                <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">P{proc.pid}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{proc.arrival}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{proc.burst}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{proc.start}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{proc.finish}</td>
                  <td className="px-4 py-3 text-blue-600 dark:text-blue-400 font-semibold">{proc.turnaround}</td>
                  <td className="px-4 py-3 text-green-600 dark:text-green-400 font-semibold">{proc.waiting}</td>
                  <td className="px-4 py-3 text-purple-600 dark:text-purple-400 font-semibold">{proc.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeline */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Execution Timeline
        </h2>
        <div className="space-y-2">
          {results.timeline.map((event, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <span className="font-semibold text-blue-600 dark:text-blue-400 w-16">
                P{event.pid}
              </span>
              <div className="flex-1">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>Start: {event.start}</span>
                  <span>→</span>
                  <span>End: {event.end}</span>
                  <span className="text-gray-400">|</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Duration: {event.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
