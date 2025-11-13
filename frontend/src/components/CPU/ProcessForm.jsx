import { Plus, Trash2, Users } from 'lucide-react';

export default function ProcessForm({ processes, onAdd, onRemove, onUpdate, showPriority }) {
  return (
    <div className="card animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Configure Processes
          </h2>
        </div>
        <button
          onClick={onAdd}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Process</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                PID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Arrival Time
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Burst Time
              </th>
              {showPriority && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Priority
                </th>
              )}
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {processes.map((proc, index) => (
              <tr 
                key={index} 
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="badge">P{proc.pid}</span>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={proc.arrival}
                    onChange={(e) => onUpdate(index, 'arrival', e.target.value)}
                    className="input-field w-24"
                    min="0"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={proc.burst}
                    onChange={(e) => onUpdate(index, 'burst', e.target.value)}
                    className="input-field w-24"
                    min="1"
                  />
                </td>
                {showPriority && (
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={proc.priority}
                      onChange={(e) => onUpdate(index, 'priority', e.target.value)}
                      className="input-field w-24"
                      min="0"
                    />
                  </td>
                )}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onRemove(index)}
                    disabled={processes.length === 1}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    title="Remove process"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Total processes: {processes.length}
      </p>
    </div>
  );
}
