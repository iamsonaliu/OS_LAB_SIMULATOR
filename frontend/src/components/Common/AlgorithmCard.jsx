import { Check } from 'lucide-react';

export default function AlgorithmCard({ name, description, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-5 rounded-xl border-2 text-left transition-all duration-200
        transform hover:scale-105 hover:shadow-lg
        ${selected
          ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 shadow-lg scale-105'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md'
        }
      `}
    >
      {selected && (
        <div className="absolute top-2 right-2">
          <div className="bg-primary-600 rounded-full p-1">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
      <h3 className={`font-bold text-lg mb-2 ${selected ? 'text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-white'}`}>
        {name}
      </h3>
      <p className={`text-sm ${selected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'}`}>
        {description}
      </p>
    </button>
  );
}
