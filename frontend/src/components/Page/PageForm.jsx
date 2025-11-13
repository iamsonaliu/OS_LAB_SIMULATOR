import { FileText, Settings } from 'lucide-react';

export default function PageForm({ pageSequence, setPageSequence, frameCount, setFrameCount }) {
  return (
    <div className="card animate-fade-in">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Configure Parameters
        </h2>
      </div>
      
      <div className="space-y-6">
        {/* Page Reference String */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Page Reference String
            <span className="text-gray-500 text-xs ml-2">(space-separated numbers)</span>
          </label>
          <input
            type="text"
            value={pageSequence}
            onChange={(e) => setPageSequence(e.target.value)}
            placeholder="e.g., 7 0 1 2 0 3 0 4 2 3"
            className="input-field font-mono"
          />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="badge-info">{pageSequence.split(/\s+/).filter(p => p).length} pages</span>
          </p>
        </div>

        {/* Frame Count */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Number of Frames
          </label>
          <input
            type="number"
            value={frameCount}
            onChange={(e) => setFrameCount(parseInt(e.target.value) || 1)}
            className="input-field w-32"
            min="1"
            max="10"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Range: 1 - 10 frames
          </p>
        </div>

        {/* Quick Examples */}
        <div>
          <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
            Quick Examples:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPageSequence('7 0 1 2 0 3 0 4 2 3')}
              className="btn-ghost text-sm px-4 py-2"
            >
              Example 1
            </button>
            <button
              onClick={() => setPageSequence('1 3 0 3 5 6 3')}
              className="btn-ghost text-sm px-4 py-2"
            >
              Example 2
            </button>
            <button
              onClick={() => setPageSequence('2 3 2 1 5 2 4 5 3 2 5 2')}
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
