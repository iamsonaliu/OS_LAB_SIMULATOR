import { TrendingUp, Clock, Cpu, Activity } from 'lucide-react';
import { formatNumber } from '../../utils/helpers';

export default function MetricsCard({ metrics, type = 'cpu' }) {
  const getMetricsConfig = () => {
    if (type === 'cpu') {
      return [
        { 
          label: 'Avg Waiting Time', 
          value: metrics.avg_waiting_time, 
          icon: Clock, 
          suffix: 'units', 
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          valueColor: 'text-blue-600 dark:text-blue-400'
        },
        { 
          label: 'Avg Turnaround Time', 
          value: metrics.avg_turnaround_time, 
          icon: TrendingUp, 
          suffix: 'units',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          iconColor: 'text-green-600 dark:text-green-400',
          valueColor: 'text-green-600 dark:text-green-400'
        },
        { 
          label: 'CPU Utilization', 
          value: metrics.cpu_utilization, 
          icon: Cpu, 
          suffix: '%',
          bgColor: 'bg-purple-100 dark:bg-purple-900/30',
          iconColor: 'text-purple-600 dark:text-purple-400',
          valueColor: 'text-purple-600 dark:text-purple-400'
        },
        { 
          label: 'Throughput', 
          value: metrics.throughput, 
          icon: Activity, 
          suffix: 'p/unit',
          bgColor: 'bg-orange-100 dark:bg-orange-900/30',
          iconColor: 'text-orange-600 dark:text-orange-400',
          valueColor: 'text-orange-600 dark:text-orange-400'
        },
      ];
    } else if (type === 'page') {
      return [
        { 
          label: 'Page Faults', 
          value: metrics.page_faults, 
          icon: TrendingUp, 
          suffix: '',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          iconColor: 'text-red-600 dark:text-red-400',
          valueColor: 'text-red-600 dark:text-red-400'
        },
        { 
          label: 'Page Hits', 
          value: metrics.page_hits, 
          icon: Activity, 
          suffix: '',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          iconColor: 'text-green-600 dark:text-green-400',
          valueColor: 'text-green-600 dark:text-green-400'
        },
        { 
          label: 'Hit Ratio', 
          value: metrics.hit_ratio, 
          icon: TrendingUp, 
          suffix: '%',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          valueColor: 'text-blue-600 dark:text-blue-400'
        },
        { 
          label: 'Fault Ratio', 
          value: metrics.fault_ratio, 
          icon: Clock, 
          suffix: '%',
          bgColor: 'bg-orange-100 dark:bg-orange-900/30',
          iconColor: 'text-orange-600 dark:text-orange-400',
          valueColor: 'text-orange-600 dark:text-orange-400'
        },
      ];
    } else {
      return [
        { 
          label: 'Total Seek Time', 
          value: metrics.total_seek, 
          icon: TrendingUp, 
          suffix: 'cyl',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          valueColor: 'text-blue-600 dark:text-blue-400'
        },
        { 
          label: 'Avg Seek Time', 
          value: metrics.avg_seek, 
          icon: Activity, 
          suffix: 'cyl',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          iconColor: 'text-green-600 dark:text-green-400',
          valueColor: 'text-green-600 dark:text-green-400'
        },
        { 
          label: 'Max Seek', 
          value: metrics.max_seek, 
          icon: Cpu, 
          suffix: 'cyl',
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          iconColor: 'text-red-600 dark:text-red-400',
          valueColor: 'text-red-600 dark:text-red-400'
        },
        { 
          label: 'Min Seek', 
          value: metrics.min_seek, 
          icon: Clock, 
          suffix: 'cyl',
          bgColor: 'bg-purple-100 dark:bg-purple-900/30',
          iconColor: 'text-purple-600 dark:text-purple-400',
          valueColor: 'text-purple-600 dark:text-purple-400'
        },
      ];
    }
  };

  const metricsConfig = getMetricsConfig();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsConfig.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div 
            key={index} 
            className="card-hover animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {metric.label}
                </p>
                <p className={`text-3xl font-bold ${metric.valueColor} mb-1`}>
                  {formatNumber(metric.value)}
                </p>
                {metric.suffix && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {metric.suffix}
                  </p>
                )}
              </div>
              <div className={`p-4 ${metric.bgColor} rounded-xl`}>
                <Icon className={`w-8 h-8 ${metric.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
