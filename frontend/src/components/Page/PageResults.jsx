import MetricsCard from '../Common/MetricsCard';
import PageReplacementChart from '../Charts/PageReplacementChart';
import { TrendingUp, Activity, CheckCircle, XCircle } from 'lucide-react';

export default function PageResults({ results, algorithm, frameCount }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metrics */}
      <div>
        <h2 className="section-title">Performance Metrics</h2>
        <p className="section-subtitle">
          Key performance indicators for the {algorithm} algorithm
        </p>
        <MetricsCard metrics={results.metrics} type="page" />
      </div>

      {/* Interactive Charts */}
      <PageReplacementChart
        trace={results.trace}
        algorithm={algorithm}
        frameCount={frameCount}
      />
    </div>
  );
}
