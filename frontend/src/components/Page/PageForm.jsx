export default function PageForm({ pageSequence, setPageSequence, frameCount, setFrameCount }) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Configure Parameters
      </h2>
      
      <div className="space-y-4">
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
            className="input-field"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Current: [{pageSequence.split(/\s+/).filter(p => p).length} pages]
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
        </div>

        {/* Quick Examples */}
        <div>
          <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Quick Examples:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPageSequence('7 0 1 2 0 3 0 4 2 3')}
              className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Example 1
            </button>
            <button
              onClick={() => setPageSequence('1 3 0 3 5 6 3')}
              className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Example 2
            </button>
            <button
              onClick={() => setPageSequence('2 3 2 1 5 2 4 5 3 2 5 2')}
              className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Example 3
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}