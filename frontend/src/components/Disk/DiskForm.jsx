import { ArrowLeft, ArrowRight, HardDrive, Settings } from 'lucide-react';

export default function DiskForm({
  requestQueue,
  setRequestQueue,
  initialHead,
  setInitialHead,
  diskSize,
  setDiskSize,
  direction,
  setDirection,
  needsDirection
}) {
  return (
    <div className="card animate-fade-in">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Configure Parameters
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Request Queue */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Request Queue (Cylinder Numbers)
            <span className="text-gray-500 text-xs ml-2">(space-separated)</span>
          </label>
          <input
            type="text"
            value={requestQueue}
            onChange={(e) => setRequestQueue(e.target.value)}
            placeholder="e.g., 98 183 37 122 14 124 65 67"
            className="input-field font-mono"
          />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="badge-info">{requestQueue.split(/\s+/).filter(r => r).length} requests</span>
          </p>
        </div>

        {/* Initial Head Position */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Initial Head Position
          </label>
          <input
            type="number"
            value={initialHead}
            onChange={(e) => setInitialHead(parseInt(e.target.value) || 0)}
            className="input-field"
            min="0"
            max={diskSize - 1}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Range: 0 - {diskSize - 1}
          </p>
        </div>

        {/* Disk Size */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Disk Size (Cylinders)
          </label>
          <input
            type="number"
            value={diskSize}
            onChange={(e) => setDiskSize(parseInt(e.target.value) || 200)}
            className="input-field"
            min="50"
            max="500"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Range: 50 - 500
          </p>
        </div>

        {/* Direction (for SCAN/LOOK algorithms) */}
        {needsDirection && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              Initial Direction
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDirection('right')}
                className={`flex items-center justify-center space-x-3 px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
                  direction === 'right'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-lg scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:shadow-md'
                }`}
              >
                <ArrowRight className="w-5 h-5" />
                <span className="font-medium">Right (Increasing)</span>
              </button>
              <button
                onClick={() => setDirection('left')}
                className={`flex items-center justify-center space-x-3 px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
                  direction === 'left'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-lg scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:shadow-md'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Left (Decreasing)</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Examples */}
        <div className="md:col-span-2">
          <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
            Quick Examples:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setRequestQueue('98 183 37 122 14 124 65 67');
                setInitialHead(53);
              }}
              className="btn-ghost text-sm px-4 py-2"
            >
              Example 1
            </button>
            <button
              onClick={() => {
                setRequestQueue('82 170 43 140 24 16 190');
                setInitialHead(50);
              }}
              className="btn-ghost text-sm px-4 py-2"
            >
              Example 2
            </button>
            <button
              onClick={() => {
                setRequestQueue('176 79 34 60 92 11 41 114');
                setInitialHead(50);
              }}
              className="btn-ghost text-sm px-4 py-2"
            >
              Example 3
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
