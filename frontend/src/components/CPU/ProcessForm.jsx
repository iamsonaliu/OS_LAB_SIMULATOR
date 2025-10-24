import { Plus, Trash2 } from 'lucide-react';

export default function ProcessForm({ processes, onAdd, onRemove, onUpdate, showPriority }) {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Configure Processes
        </h2>
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
            <tr className="border-b dark:border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                PID
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Arrival Time
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Burst Time
              </th>
              {showPriority && (
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority
                </th>
              )}
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {processes.map((proc, index) => (
              <tr key={index} className="border-b dark:border-gray-700">
                <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                  P{proc.pid}
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
                <td className="px-4 py-3">
                  <button
                    onClick={() => onRemove(index)}
                    disabled={processes.length === 1}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}