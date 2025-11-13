import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getRandomColor } from '../../utils/helpers';

export default function DiskMovementChart({ sequence, trace, initialHead, algorithm }) {
  // Transform data for chart
  const chartData = [
    { step: 0, position: initialHead, label: 'Start' },
    ...trace.map((step, index) => ({
      step: step.step,
      position: step.to_cylinder,
      seek: step.seek_distance,
      cumulative: step.cumulative_seek,
      from: step.from_cylinder,
      to: step.to_cylinder,
      label: `Step ${step.step}`,
    })),
  ];

  const maxCylinder = Math.max(...sequence, initialHead);
  const minCylinder = Math.min(...sequence, initialHead);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{data.label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Position: <span className="font-medium">{data.position}</span>
          </p>
          {data.seek !== undefined && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Seek: <span className="font-medium">{data.seek}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cumulative: <span className="font-medium">{data.cumulative}</span>
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Head Movement - {algorithm}
        </h3>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-gray-700" />
            <XAxis 
              dataKey="step" 
              stroke="#64748b"
              className="dark:stroke-gray-400"
              label={{ value: 'Step', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              domain={[Math.max(0, minCylinder - 10), maxCylinder + 10]}
              stroke="#64748b"
              className="dark:stroke-gray-400"
              label={{ value: 'Cylinder', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine 
              y={initialHead} 
              stroke="#10b981" 
              strokeDasharray="5 5" 
              label={{ value: 'Initial', position: 'right' }}
            />
            <Line 
              type="monotone" 
              dataKey="position" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 5 }}
              activeDot={{ r: 7 }}
              name="Head Position"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Seek Distance Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Seek Distance per Step
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trace} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              label={{ value: 'Seek Distance', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="seek_distance" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 4 }}
              name="Seek Distance"
            />
            <Line 
              type="monotone" 
              dataKey="cumulative_seek" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              name="Cumulative Seek"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

