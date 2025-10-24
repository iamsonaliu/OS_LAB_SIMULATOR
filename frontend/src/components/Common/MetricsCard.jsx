import { TrendingUp, Clock, Cpu, Activity } from 'lucide-react';
import { formatNumber } from '../../utils/helpers';

export default function MetricsCard({ metrics, type = 'cpu' }) {
  const getMetricsConfig = () => {
    if (type === 'cpu') {
      return [
        { label: 'Avg Waiting Time', value: metrics.avg_waiting_time, icon: Clock, suffix: 'units', color: 'blue' },
        { label: 'Avg Turnaround Time', value: metrics.avg_turnaround_time, icon: TrendingUp, suffix: 'units', color: 'green' },
        { label: 'CPU Utilization', value: metrics.cpu_utilization, icon: Cpu, suffix: '%', color: 'purple' },
        { label: 'Throughput', value: metrics.throughput, icon: Activity, suffix: 'p/unit', color: 'orange' },
      ];
    } else if (type === 'page') {
      return [
        { label: 'Page Faults', value: metrics.page_faults, icon: TrendingUp, suffix: '', color: 'red' },
        { label: 'Page Hits', value: metrics.page_hits, icon: Activity, suffix: '', color: 'green' },
        { label: 'Hit Ratio', value: metrics.hit_ratio, icon: TrendingUp, suffix: '%', color: 'blue' },
        { label: 'Fault Ratio', value: metrics.fault_ratio, icon: Clock, suffix: '%', color: 'orange' },
      ];
    } else {
      return [
        { label: 'Total Seek Time', value: metrics.total_seek, icon: TrendingUp, suffix: 'cyl', color: 'blue' },
        { label: 'Avg Seek Time', value: metrics.avg_seek, icon: Activity, suffix: 'cyl', color: 'green' },
        { label: 'Max Seek', value: metrics.max_seek, icon: Cpu, suffix: 'cyl', color: 'red' },
        { label: 'Min Seek', value: metrics.min_seek, icon: Clock, suffix: 'cyl', color: 'purple' },
      ];
    }
  };

  const metricsConfig = getMetricsConfig();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsConfig.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(metric.value)}
                  <span className="text-sm text-gray-500 ml-1">{metric.suffix}</span>
                </p>
              </div>
              <div className={`p-3 bg-${metric.color}-100 dark:bg-${metric.color}-900/20 rounded-lg`}>
                <Icon className={`w-6 h-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}