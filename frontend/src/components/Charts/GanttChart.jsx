import { getRandomColor } from '../../utils/helpers';
import { Clock, Activity } from 'lucide-react';

export default function GanttChart({ timeline, algorithm }) {
  // Get unique process IDs for colors
  const processIds = [...new Set(timeline.map(e => e.pid))];
  const colorMap = {};
  processIds.forEach((pid, index) => {
    colorMap[pid] = getRandomColor(index);
  });

  // Calculate max time
  const maxTime = Math.max(...timeline.map(e => e.end), 0);

  // Group timeline by process for better visualization
  const processGroups = processIds.map(pid => ({
    pid,
    events: timeline.filter(e => e.pid === pid),
  }));

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Execution Timeline - {algorithm}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Visual representation of process execution over time
            </p>
          </div>
        </div>
        
        {/* Timeline Visualization */}
        <div className="mb-8">
          <div className="flex flex-col space-y-4">
            {processGroups.map(({ pid, events }) => (
              <div key={pid} className="space-y-2">
                <div className="flex items-center space-x-4">
                  <div className="w-16 flex items-center space-x-2">
                    <span className="badge px-3 py-1">P{pid}</span>
                  </div>
                  <div className="flex-1 relative h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                    {events.map((event, idx) => (
                      <div
                        key={idx}
                        className="absolute h-full flex items-center justify-center text-white text-xs font-semibold transition-all duration-300 hover:opacity-90 hover:z-10 cursor-pointer group"
                        style={{
                          left: `${(event.start / maxTime) * 100}%`,
                          width: `${(event.duration / maxTime) * 100}%`,
                          backgroundColor: colorMap[pid],
                          minWidth: '20px',
                        }}
                        title={`P${pid}: Time ${event.start}-${event.end} (Duration: ${event.duration})`}
                      >
                        {event.duration >= (maxTime * 0.08) && (
                          <span className="px-2 py-1 bg-black/20 rounded backdrop-blur-sm">
                            {event.duration}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Time scale */}
          <div className="flex justify-between mt-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
            <span>0</span>
            <span>{maxTime}</span>
          </div>
        </div>

        {/* Timeline Events Table */}
        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary-600" />
            <span>Execution Events</span>
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Process</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Start</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">End</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Duration</th>
                </tr>
              </thead>
              <tbody>
                {timeline.map((event, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span 
                        className="badge px-3 py-1"
                        style={{ backgroundColor: colorMap[event.pid] + '20', color: colorMap[event.pid] }}
                      >
                        P{event.pid}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{event.start}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{event.end}</td>
                    <td className="px-4 py-3">
                      <span className="badge-info">{event.duration}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
