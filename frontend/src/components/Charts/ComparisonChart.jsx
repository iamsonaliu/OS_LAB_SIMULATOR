import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { getRandomColor } from '../../utils/helpers';

export default function ComparisonChart({ comparisonData, metric, type = 'cpu' }) {
  // Transform data for comparison
  const chartData = Object.entries(comparisonData).map(([algorithm, metrics]) => ({
    algorithm,
    value: metrics[metric] || 0,
    ...metrics,
  }));

  // Get color for each algorithm
  const algorithms = Object.keys(comparisonData);
  const colors = algorithms.map((_, index) => getRandomColor(index));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{data.algorithm}</p>
          {type === 'cpu' && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Avg Waiting Time: <span className="font-medium">{data.avg_waiting_time?.toFixed(2)}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Avg Turnaround Time: <span className="font-medium">{data.avg_turnaround_time?.toFixed(2)}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                CPU Utilization: <span className="font-medium">{data.cpu_utilization?.toFixed(2)}%</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Throughput: <span className="font-medium">{data.throughput?.toFixed(4)}</span>
              </p>
            </>
          )}
          {type === 'disk' && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Seek: <span className="font-medium">{data.total_seek}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Avg Seek: <span className="font-medium">{data.avg_seek?.toFixed(2)}</span>
              </p>
            </>
          )}
          {type === 'page' && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Page Faults: <span className="font-medium">{data.page_faults}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hit Ratio: <span className="font-medium">{data.hit_ratio?.toFixed(2)}%</span>
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const getMetricLabel = () => {
    const labels = {
      cpu: {
        avg_waiting_time: 'Average Waiting Time',
        avg_turnaround_time: 'Average Turnaround Time',
        cpu_utilization: 'CPU Utilization (%)',
        throughput: 'Throughput',
      },
      disk: {
        total_seek: 'Total Seek Time',
        avg_seek: 'Average Seek Time',
      },
      page: {
        page_faults: 'Page Faults',
        hit_ratio: 'Hit Ratio (%)',
      },
    };
    return labels[type]?.[metric] || metric;
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {getMetricLabel()} Comparison
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-gray-700" />
          <XAxis 
            dataKey="algorithm" 
            stroke="#64748b"
            className="dark:stroke-gray-400"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#64748b"
            className="dark:stroke-gray-400"
            label={{ value: getMetricLabel(), angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="value" name={getMetricLabel()} radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

