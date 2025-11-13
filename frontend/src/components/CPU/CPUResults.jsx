import MetricsCard from '../Common/MetricsCard';
import GanttChart from '../Charts/GanttChart';
import { Clock, TrendingUp, Cpu, Activity } from 'lucide-react';

export default function CPUResults({ results, algorithm }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metrics */}
      <div>
        <h2 className="section-title">Performance Metrics</h2>
        <p className="section-subtitle">
          Key performance indicators for the {algorithm} algorithm
        </p>
        <MetricsCard metrics={results.metrics} type="cpu" />
      </div>

      {/* Interactive Gantt Chart */}
      <GanttChart timeline={results.timeline} algorithm={algorithm} />

      {/* Process Details Table */}
      <div className="card">
        <h2 className="section-title">Process Execution Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
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
                <tr 
                  key={index} 
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                    <span className="badge">P{proc.pid}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{proc.arrival}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{proc.burst}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{proc.start}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{proc.finish}</td>
                  <td className="px-4 py-3">
                    <span className="badge-info">{proc.turnaround}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge-warning">{proc.waiting}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge-success">{proc.response}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeline */}
      <div className="card">
        <h2 className="section-title">Execution Timeline</h2>
        <p className="section-subtitle">
          Detailed step-by-step execution timeline
        </p>
        <div className="space-y-2">
          {results.timeline.map((event, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl hover:shadow-md transition-all duration-200"
            >
              <div className="flex-shrink-0">
                <span className="badge text-lg px-4 py-2">P{event.pid}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Start: <span className="font-semibold text-gray-900 dark:text-white">{event.start}</span></span>
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>End: <span className="font-semibold text-gray-900 dark:text-white">{event.end}</span></span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <div className="flex items-center space-x-1">
                    <Activity className="w-4 h-4 text-primary-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Duration: {event.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
