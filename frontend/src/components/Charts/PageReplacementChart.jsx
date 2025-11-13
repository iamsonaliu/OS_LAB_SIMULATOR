import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle, XCircle } from 'lucide-react';

export default function PageReplacementChart({ trace, algorithm, frameCount }) {
  // Transform data for chart
  const chartData = trace.map((step) => ({
    step: step.step,
    page: step.page,
    faults: step.status === 'FAULT' ? 1 : 0,
    hits: step.status === 'HIT' ? 1 : 0,
    status: step.status,
    frames: step.frames_state,
  }));

  // Calculate cumulative faults
  let cumulativeFaults = 0;
  const cumulativeData = chartData.map(item => {
    if (item.faults) cumulativeFaults++;
    return {
      ...item,
      cumulativeFaults,
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">Step {data.step}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Page: <span className="font-medium">{data.page}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Status: <span className={`font-medium ${data.status === 'HIT' ? 'text-green-600' : 'text-red-600'}`}>
              {data.status}
            </span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Frames: <span className="font-medium">{data.frames.filter(f => f !== -1).join(', ')}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Page Reference Pattern - {algorithm}
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-gray-700" />
            <XAxis 
              dataKey="step" 
              stroke="#64748b"
              className="dark:stroke-gray-400"
              label={{ value: 'Step', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              stroke="#64748b"
              className="dark:stroke-gray-400"
              label={{ value: 'Page Number', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="page" fill="#6366f1" name="Page Reference" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.status === 'HIT' ? '#10b981' : '#ef4444'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cumulative Faults Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Cumulative Page Faults
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cumulativeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-gray-700" />
            <XAxis 
              dataKey="step" 
              stroke="#64748b"
              className="dark:stroke-gray-400"
              label={{ value: 'Step', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              stroke="#64748b"
              className="dark:stroke-gray-400"
              label={{ value: 'Cumulative Faults', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="cumulativeFaults" fill="#ef4444" name="Cumulative Page Faults" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Frame State Visualization */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Frame State Timeline
        </h3>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Step</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Page</th>
                  {Array.from({ length: frameCount }).map((_, i) => (
                    <th key={i} className="px-4 py-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Frame {i + 1}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {trace.map((step, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      step.status === 'FAULT' ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{step.step}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-semibold text-lg">{step.page}</td>
                    {step.frames_state.map((frame, i) => (
                      <td key={i} className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg font-semibold text-sm ${
                            frame === -1
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                              : frame === step.page && step.status === 'FAULT'
                              ? 'bg-red-500 text-white animate-pulse'
                              : frame === step.page && step.status === 'HIT'
                              ? 'bg-green-500 text-white'
                              : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          }`}
                        >
                          {frame === -1 ? '—' : frame}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center">
                      {step.status === 'HIT' ? (
                        <span className="inline-flex items-center space-x-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">HIT</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-red-600 dark:text-red-400">
                          <XCircle className="w-5 h-5" />
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
    </div>
  );
}

